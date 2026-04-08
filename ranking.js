// ranking.js — Target District Ranking logic
(function () {
    'use strict';

    // ── Party color map (raw hex for inline bar usage) ──────────────────
    const PARTY_HEX = {
        'ประชาชน': '#f97316',
        'เพื่อไทย': '#ef4444',
        'ภูมิใจไทย': '#1e3a8a',
        'กล้าธรรม': '#84cc16',
        'พลังประชารัฐ': '#166534',
        'ประชาธิปัตย์': '#38bdf8',
        'ไทรวมพลัง': '#db2777',
        'ประชาชาติ': '#b45309',
        'ไทยสร้างไทย': '#9333ea'
    };
    function partyColor(name) { return PARTY_HEX[name] || '#64748b'; }
    const fmt = n => n.toLocaleString('th-TH');

    // ── Parse data ─────────────────────────────────────────────────────
    function normProv(p) {
        if (!p || p === 'UNKNOWN') return null;
        if (p === 'Bangkok') return 'กรุงเทพมหานคร';
        if (p === 'Sakon Nakhon') return 'สกลนคร';
        return p;
    }

    // Build constituency scores: prov → dist → [{party, votes, name}] sorted desc
    function buildConstituencyScores() {
        const results = Papa.parse(constituencyCsvData, { header: true, skipEmptyLines: true });
        const agg = {};
        results.data.forEach(row => {
            const prov = normProv(row['จังหวัด']);
            if (!prov) return;
            const dist = row['เขต'] || '';
            const party = row['พรรค'] || '';
            const votes = parseInt(row['คะแนน']) || 0;
            const name = row['ชื่อผู้สมัคร'] || '';
            if (!party) return;
            const key = `${prov}|${dist}`;
            if (!agg[key]) agg[key] = {};
            if (!agg[key][party] || votes > agg[key][party].votes) {
                agg[key][party] = { votes, name };
            }
        });

        const scores = {};
        Object.entries(agg).forEach(([key, parties]) => {
            const [prov, dist] = key.split('|');
            const sorted = Object.entries(parties)
                .map(([party, d]) => ({ party, votes: d.votes, name: d.name }))
                .sort((a, b) => b.votes - a.votes);
            if (!scores[prov]) scores[prov] = {};
            scores[prov][dist] = sorted;
        });
        return scores;
    }

    // Build district info from electionCsvData: turnout, valid votes
    function buildDistrictInfo() {
        const info = {};
        const results = Papa.parse(electionCsvData, { header: true, skipEmptyLines: true });
        results.data.forEach(row => {
            const prov = normProv(row['จังหวัด']);
            if (!prov) return;
            const dist = row['เขต'] || '';
            info[`${prov}|${dist}`] = {
                eligible: parseInt(row['ผู้มีสิทธิ']) || 0,
                voted: parseInt(row['มาใช้สิทธิ']) || 0,
                valid: parseInt(row['คะแนนดี']) || 0,
                winner: row['ผู้ชนะ'] || '',
                winnerParty: row['พรรค'] || ''
            };
        });
        return info;
    }

    // ── Main analysis ──────────────────────────────────────────────────
    function analyzeTargets(focusParty, scores, districtInfo) {
        const targets = [];
        Object.entries(scores).forEach(([prov, dists]) => {
            Object.entries(dists).forEach(([dist, sorted]) => {
                const rankIdx = sorted.findIndex(s => s.party === focusParty);
                if (rankIdx === -1) return; // not present

                const focusData = sorted[rankIdx];
                let rival, marginVotes, status;

                if (rankIdx === 0) {
                    // Defending: we are #1 → compare with #2
                    status = 'defend';
                    rival = sorted.length > 1 ? sorted[1] : null;
                    marginVotes = rival ? focusData.votes - rival.votes : Infinity;
                } else if (rankIdx === 1) {
                    // Best attack target: we are #2 → compare with #1
                    status = 'attack';
                    rival = sorted[0];
                    marginVotes = rival.votes - focusData.votes;
                } else {
                    // Deep target: we are #3+ → compare with #1
                    status = 'deep';
                    rival = sorted[0];
                    marginVotes = rival.votes - focusData.votes;
                }

                if (!rival) return;

                const key = `${prov}|${dist}`;
                const di = districtInfo[key] || {};
                const validVotes = di.valid || sorted.reduce((s, x) => s + x.votes, 0);
                const marginPct = validVotes > 0 ? (marginVotes / validVotes * 100) : 0;
                const turnoutPct = di.eligible > 0 ? (di.voted / di.eligible * 100) : 0;
                const rank = rankIdx + 1; // 1-based

                // Composite "flip score" (lower = easier to flip)
                // Rank 2 gets the best multiplier. Turnout upside can help.
                const rankWeight = rank === 2 ? 1.0 : (rank === 1 ? 1.0 : rank * 0.8);
                const turnoutFactor = Math.max(0.5, (100 - turnoutPct) / 100); // lower turnout = more room
                const flipScore = marginPct * rankWeight / turnoutFactor;

                targets.push({
                    prov, dist, status, rank, flipScore,
                    focusParty, focusVotes: focusData.votes, focusName: focusData.name,
                    rivalParty: rival.party, rivalVotes: rival.votes, rivalName: rival.name,
                    marginVotes, marginPct, turnoutPct, validVotes,
                    winnerParty: di.winnerParty || sorted[0].party
                });
            });
        });

        // Sort: easiest to hardest
        targets.sort((a, b) => {
            // Attack (rank 2) first, then Defend (rank 1), then Deep (rank 3+)
            const catA = a.rank === 2 ? 0 : (a.rank === 1 ? 1 : 2);
            const catB = b.rank === 2 ? 0 : (b.rank === 1 ? 1 : 2);
            if (catA !== catB) return catA - catB;
            return a.flipScore - b.flipScore;
        });

        return targets;
    }

    // ── Render ──────────────────────────────────────────────────────────
    function render(targets, limit, focusParty) {
        const container = document.getElementById('list-container');
        const pills = document.getElementById('stat-pills');

        // Stats
        const attackCount = targets.filter(t => t.status === 'attack').length;
        const defendCount = targets.filter(t => t.status === 'defend').length;
        const deepCount = targets.filter(t => t.status === 'deep').length;

        pills.innerHTML = `
            <div class="stat-pill"><span>⚔️ พลิกชนะ</span><span class="num">${attackCount}</span></div>
            <div class="stat-pill"><span>🛡️ ป้องกัน</span><span class="num">${defendCount}</span></div>
            <div class="stat-pill"><span>📊 รวม</span><span class="num">${targets.length}</span></div>
        `;

        // Group by status for rendering
        const shown = targets.slice(0, limit);
        const attacks = shown.filter(t => t.status === 'attack');
        const defends = shown.filter(t => t.status === 'defend');
        const deeps = shown.filter(t => t.status === 'deep');

        let html = '';

        const sections = [
            { items: attacks, icon: '⚔️', label: 'เป้าหมายพลิกชนะ (ได้ที่ 2)', cls: 'attack' },
            { items: defends, icon: '🛡️', label: 'ป้องกันแชมป์ (ได้ที่ 1)', cls: 'defend' },
            { items: deeps, icon: '📉', label: 'เป้าหมายระยะไกล (ที่ 3+)', cls: 'deep' }
        ];

        let globalIdx = 0;

        sections.forEach(sec => {
            if (sec.items.length === 0) return;
            html += `
                <div class="section-divider">
                    <div class="icon ${sec.cls}">${sec.icon}</div>
                    <h2>${sec.label}</h2>
                    <span class="count">${sec.items.length} เขต</span>
                </div>
            `;
            sec.items.forEach(t => {
                globalIdx++;
                const maxV = Math.max(t.focusVotes, t.rivalVotes);
                const focusW = maxV > 0 ? (t.focusVotes / maxV * 100) : 0;
                const rivalW = maxV > 0 ? (t.rivalVotes / maxV * 100) : 0;

                html += `
                <div class="rank-card">
                    <div class="rank-card-top">
                        <div class="rank-number ${sec.cls}">${globalIdx}</div>
                        <div class="rank-info">
                            <div class="rank-title">${t.prov} เขต ${t.dist}</div>
                            <div class="rank-subtitle">${t.status === 'defend' ? 'คู่แข่ง: ' : 'ผู้ชนะปัจจุบัน: '}${t.rivalName} (${t.rivalParty})</div>
                        </div>
                        <div class="rank-badges">
                            <span class="badge badge-${sec.cls}">${t.status === 'attack' ? 'อันดับ 2' : t.status === 'defend' ? 'แชมป์' : 'อันดับ ' + t.rank}</span>
                            <span class="badge badge-margin">ห่าง ${t.marginPct.toFixed(2)}%</span>
                            <span class="badge badge-turnout">TO ${t.turnoutPct.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="bar-pair">
                        <div class="bar-row">
                            <span class="bar-label">${focusParty}</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: ${focusW}%; background: ${partyColor(focusParty)};">${fmt(t.focusVotes)}</div>
                            </div>
                            <span class="bar-votes-label">${t.marginPct.toFixed(1)}%</span>
                        </div>
                        <div class="bar-row">
                            <span class="bar-label">${t.rivalParty}</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: ${rivalW}%; background: ${partyColor(t.rivalParty)};">${fmt(t.rivalVotes)}</div>
                            </div>
                            <span class="bar-votes-label">${fmt(t.marginVotes)}</span>
                        </div>
                    </div>
                </div>`;
            });
        });

        container.innerHTML = html;
    }

    // ── Boot ────────────────────────────────────────────────────────────
    const FOCUS_PARTY = 'ประชาชน';
    const REGION_MAP = {
        'north': ['เชียงราย','พะเยา','น่าน','เชียงใหม่','แม่ฮ่องสอน','ลำพูน','ลำปาง','แพร่','อุตรดิตถ์','สุโขทัย','ตาก','กำแพงเพชร','พิษณุโลก','พิจิตร','เพชรบูรณ์','นครสวรรค์','อุทัยธานี'],
        'northeast': ['เลย','หนองคาย','บึงกาฬ','หนองบัวลำภู','อุดรธานี','สกลนคร','นครพนม','ชัยภูมิ','ขอนแก่น','กาฬสินธุ์','มุกดาหาร','นครราชสีมา','บุรีรัมย์','มหาสารคาม','ร้อยเอ็ด','ยโสธร','อำนาจเจริญ','สุรินทร์','ศรีสะเกษ','อุบลราชธานี'],
        'central': ['ลพบุรี','ชัยนาท','สิงห์บุรี','สุพรรณบุรี','อ่างทอง','สระบุรี','พระนครศรีอยุธยา','นครนายก','ปทุมธานี','กาญจนบุรี','ราชบุรี','นครปฐม','นนทบุรี','สมุทรปราการ','สมุทรสาคร','สมุทรสงคราม','เพชรบุรี','ประจวบคีรีขันธ์'],
        'east': ['ปราจีนบุรี','สระแก้ว','ฉะเชิงเทรา','ชลบุรี','ระยอง','จันทบุรี','ตราด'],
        'south': ['ชุมพร','ระนอง','สุราษฎร์ธานี','พังงา','นครศรีธรรมราช','ภูเก็ต','กระบี่','ตรัง','พัทลุง','สตูล','สงขลา','ปัตตานี','ยะลา','นราธิวาส'],
        'bangkok': ['กรุงเทพมหานคร']
    };

    let scores, districtInfo;

    function refresh() {
        const region = document.getElementById('focus-region').value;
        const sortOrder = document.getElementById('sort-order').value;
        let targets = analyzeTargets(FOCUS_PARTY, scores, districtInfo);

        // Filter by region
        if (region !== 'all') {
            const provList = REGION_MAP[region] || [];
            targets = targets.filter(t => provList.includes(t.prov));
        }

        // Reverse if hardest first
        if (sortOrder === 'hardest') {
            targets = targets.slice().reverse();
        }

        render(targets, targets.length, FOCUS_PARTY);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Build data structures
        scores = buildConstituencyScores();
        districtInfo = buildDistrictInfo();

        // Hide loading, show UI
        document.getElementById('loading').style.display = 'none';
        document.getElementById('controls').style.display = 'flex';
        document.getElementById('list-container').style.display = 'block';

        // Initial render
        refresh();

        // Bind controls
        document.getElementById('focus-region').addEventListener('change', refresh);
        document.getElementById('sort-order').addEventListener('change', refresh);
    });
})();
