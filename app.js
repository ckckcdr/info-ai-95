const provinceGrid = {
            // เหนือ
            "เชียงราย": [1, 6], "พะเยา": [2, 7], "น่าน": [2, 8],
            "เชียงใหม่": [2, 4], "แม่ฮ่องสอน": [3, 2], "ลำพูน": [3, 4],
            "ลำปาง": [3, 5], "แพร่": [3, 6], "อุตรดิตถ์": [4, 6],
            "สุโขทัย": [4, 5], "ตาก": [5, 3], "กำแพงเพชร": [6, 4],
            "พิษณุโลก": [5, 6], "พิจิตร": [6, 5], "เพชรบูรณ์": [6, 7],
            "นครสวรรค์": [7, 5], "อุทัยธานี": [8, 4],

            // อีสาน
            "เลย": [5, 8], "หนองคาย": [5, 11], "บึงกาฬ": [5, 12],
            "หนองบัวลำภู": [6, 9], "อุดรธานี": [6, 10], "สกลนคร": [6, 13], "นครพนม": [6, 14],
            "ชัยภูมิ": [7, 8], "ขอนแก่น": [7, 10], "กาฬสินธุ์": [7, 12], "มุกดาหาร": [7, 14],
            "นครราชสีมา": [9, 8], "บุรีรัมย์": [9, 10], "มหาสารคาม": [8, 10],
            "ร้อยเอ็ด": [8, 12], "ยโสธร": [8, 14], "อำนาจเจริญ": [8, 15],
            "สุรินทร์": [10, 10], "ศรีสะเกษ": [10, 12], "อุบลราชธานี": [10, 14],

            // กลาง
            "ลพบุรี": [7, 7], "ชัยนาท": [8, 5], "สิงห์บุรี": [8, 6],
            "สุพรรณบุรี": [9, 4], "อ่างทอง": [9, 5], "สระบุรี": [9, 7],
            "พระนครศรีอยุธยา": [10, 6], "นครนายก": [10, 7], "ปทุมธานี": [11, 6],
            "กาญจนบุรี": [10, 3], "ราชบุรี": [11, 4], "นครปฐม": [11, 5],
            "นนทบุรี": [12, 5], "กรุงเทพมหานคร": [12, 6], "สมุทรปราการ": [13, 7],
            "สมุทรสาคร": [13, 5], "สมุทรสงคราม": [13, 6],

            // ตะวันออก
            "ปราจีนบุรี": [10, 9], "สระแก้ว": [10, 11],
            "ฉะเชิงเทรา": [11, 9], "ชลบุรี": [12, 9],
            "ระยอง": [13, 9], "จันทบุรี": [13, 10], "ตราด": [14, 11],

            // ตะวันตก และ ใต้ตอนบน
            "เพชรบุรี": [14, 4], "ประจวบคีรีขันธ์": [15, 4], "ชุมพร": [16, 4],
            "ระนอง": [17, 3], "สุราษฎร์ธานี": [17, 4],
            
            // ใต้
            "พังงา": [18, 3], "นครศรีธรรมราช": [18, 5], "ภูเก็ต": [19, 2],
            "กระบี่": [19, 3], "ตรัง": [19, 4], "พัทลุง": [19, 5],
            "สตูล": [20, 4], "สงขลา": [20, 5], "ปัตตานี": [20, 6],
            "ยะลา": [21, 5], "นราธิวาส": [21, 6]
        };

        function getPartyColor(partyName) {
            const colors = {
                "ประชาชน": "var(--party-prachachon)",
                "เพื่อไทย": "var(--party-pheuthai)",
                "ภูมิใจไทย": "var(--party-bhumjaithai)",
                "กล้าธรรม": "var(--party-klatham)",
                "พลังประชารัฐ": "var(--party-palangpracharath)",
                "ประชาธิปัตย์": "var(--party-democrat)",
                "ไทรวมพลัง": "var(--party-ruamthai)",
                "ประชาชาติ": "var(--party-prachachat)",
                "ไทยสร้างไทย": "var(--party-thaisangthai)"
            };
            return colors[partyName] || "var(--party-default)";
        }

        

        // Global state
        let provincesData = {};
        let currentView   = 'constituency';

        // Sidebar ranking globals (must be declared before Papa.parse runs synchronously)
        var _districtInfoMap = null;
        var PARTY_HEX = {
            'ประชาชน': '#f97316', 'เพื่อไทย': '#ef4444', 'ภูมิใจไทย': '#1e3a8a',
            'กล้าธรรม': '#84cc16', 'พลังประชารัฐ': '#166534', 'ประชาธิปัตย์': '#38bdf8',
            'ไทรวมพลัง': '#db2777', 'ประชาชาติ': '#b45309', 'ไทยสร้างไทย': '#9333ea'
        };
        var REGION_MAP = {
            'north': ['เชียงราย','พะเยา','น่าน','เชียงใหม่','แม่ฮ่องสอน','ลำพูน','ลำปาง','แพร่','อุตรดิตถ์','สุโขทัย','ตาก','กำแพงเพชร','พิษณุโลก','พิจิตร','เพชรบูรณ์','นครสวรรค์','อุทัยธานี'],
            'northeast': ['เลย','หนองคาย','บึงกาฬ','หนองบัวลำภู','อุดรธานี','สกลนคร','นครพนม','ชัยภูมิ','ขอนแก่น','กาฬสินธุ์','มุกดาหาร','นครราชสีมา','บุรีรัมย์','มหาสารคาม','ร้อยเอ็ด','ยโสธร','อำนาจเจริญ','สุรินทร์','ศรีสะเกษ','อุบลราชธานี'],
            'central': ['ลพบุรี','ชัยนาท','สิงห์บุรี','สุพรรณบุรี','อ่างทอง','สระบุรี','พระนครศรีอยุธยา','นครนายก','ปทุมธานี','กาญจนบุรี','ราชบุรี','นครปฐม','นนทบุรี','สมุทรปราการ','สมุทรสาคร','สมุทรสงคราม','เพชรบุรี','ประจวบคีรีขันธ์'],
            'east': ['ปราจีนบุรี','สระแก้ว','ฉะเชิงเทรา','ชลบุรี','ระยอง','จันทบุรี','ตราด'],
            'south': ['ชุมพร','ระนอง','สุราษฎร์ธานี','พังงา','นครศรีธรรมราช','ภูเก็ต','กระบี่','ตรัง','พัทลุง','สตูล','สงขลา','ปัตตานี','ยะลา','นราธิวาส'],
            'bangkok': ['กรุงเทพมหานคร']
        };

        // ── Custom tooltip element ────────────────────────────────────────
        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.cssText = `
            position: fixed; z-index:9999; pointer-events:none; display:none;
            background: rgba(15,23,42,0.97); color:#f8fafc;
            border-radius:10px; padding:10px 14px; font-size:0.82rem;
            line-height:1.6; max-width:240px; box-shadow:0 8px 24px rgba(0,0,0,0.35);
            border:1px solid rgba(255,255,255,0.08); font-family:inherit;
        `;
        document.body.appendChild(tooltip);

        document.addEventListener('mousemove', e => {
            if (tooltip.style.display === 'block') {
                let x = e.clientX + 14, y = e.clientY + 14;
                if (x + 250 > window.innerWidth)  x = e.clientX - 250;
                if (y + 150 > window.innerHeight)  y = e.clientY - 120;
                tooltip.style.left = x + 'px';
                tooltip.style.top  = y + 'px';
            }
        });

        // ── Build constituency score lookup: province → district → [{party,votes,name}] sorted desc ──
        let constituencyScores = null;

        function buildConstituencyScores() {
            if (constituencyScores) return;
            constituencyScores = {};
            const results = Papa.parse(constituencyCsvData, { header: true, skipEmptyLines: true });
            const agg = {};  // "prov|dist" → { party: {votes, candidate} }
            results.data.forEach(row => {
                let prov = row['จังหวัด'] || '';
                if (!prov || prov === 'UNKNOWN') return;
                if (['Bangkok'].includes(prov)) prov = 'กรุงเทพมหานคร';
                if (prov === 'Sakon Nakhon') prov = 'สกลนคร';
                const dist  = row['เขต'] || '';
                const party = row['พรรค'] || '';
                const votes = parseInt(row['คะแนน']) || 0;
                const name  = row['ชื่อผู้สมัคร'] || '';
                const key   = `${prov}|${dist}`;
                if (!party) return;
                if (!agg[key]) agg[key] = {};
                if (!agg[key][party] || votes > agg[key][party].votes) {
                    agg[key][party] = { votes, name };
                }
            });
            Object.entries(agg).forEach(([key, parties]) => {
                const [prov, dist] = key.split('|');
                const sorted = Object.entries(parties)
                    .map(([party, d]) => ({ party, votes: d.votes, name: d.name }))
                    .sort((a, b) => b.votes - a.votes);
                if (!constituencyScores[prov]) constituencyScores[prov] = {};
                constituencyScores[prov][dist] = sorted;
            });
        }

        // ── BJT comparison tooltip builder ────────────────────────────────
        const FOCUS_PARTY = 'ประชาชน';

        function buildBjtTooltip(district, province, scores) {
            // scores: [{party, votes, name}] sorted desc
            if (!scores || scores.length === 0) return `เขต ${district}`;
            const fmt = n => n.toLocaleString('th-TH');
            const focusIdx = scores.findIndex(s => s.party === FOCUS_PARTY);
            const r1 = scores[0];

            let html = `<div style="font-weight:700;margin-bottom:6px;color:#93c5fd;">📍 ${province} เขต ${district}</div>`;

            if (focusIdx === 0) {
                // ประชาชน is #1 — compare with #2
                const r2 = scores[1];
                html += `<div style="display:flex;justify-content:space-between;gap:16px">`;
                html += `<div>🥇 <b>${r1.party}</b><br><span style="color:#fbbf24">${fmt(r1.votes)} คะแนน</span></div>`;
                if (r2) html += `<div>🥈 ${r2.party}<br><span style="color:#94a3b8">${fmt(r2.votes)} คะแนน</span></div>`;
                html += `</div>`;
                if (r2) {
                    const gap = r1.votes - r2.votes;
                    html += `<div style="margin-top:6px;color:#34d399;font-size:0.75rem">ชนะห่าง ${fmt(gap)} คะแนน</div>`;
                }
            } else if (focusIdx === 1) {
                // ประชาชน is #2 — show #1 vs ประชาชน
                const focus = scores[1];
                html += `<div style="display:flex;justify-content:space-between;gap:16px">`;
                html += `<div>🥇 <b>${r1.party}</b><br><span style="color:#fbbf24">${fmt(r1.votes)} คะแนน</span></div>`;
                html += `<div>🥈 ${FOCUS_PARTY}<br><span style="color:#94a3b8">${fmt(focus.votes)} คะแนน</span></div>`;
                html += `</div>`;
                const gap = r1.votes - focus.votes;
                html += `<div style="margin-top:6px;color:#f87171;font-size:0.75rem">ประชาชนแพ้ห่าง ${fmt(gap)} คะแนน</div>`;
            } else {
                // ประชาชน is #3+ or not present — show #1 and ประชาชน's rank
                html += `<div>🥇 <b>${r1.party}</b>&nbsp;<span style="color:#fbbf24">${fmt(r1.votes)} คะแนน</span></div>`;
                if (focusIdx > 1) {
                    const focus = scores[focusIdx];
                    const gap = r1.votes - focus.votes;
                    html += `<div style="margin-top:5px;opacity:0.8">`;
                    html += `<span style="color:#94a3b8">อันดับ ${focusIdx + 1} ${FOCUS_PARTY}</span>&nbsp;${fmt(focus.votes)} คะแนน`;
                    html += `<br><span style="color:#f87171;font-size:0.75rem">แพ้ห่าง ${fmt(gap)} คะแนน</span></div>`;
                } else {
                    html += `<div style="margin-top:5px;opacity:0.6;color:#94a3b8">${FOCUS_PARTY}: ไม่มีข้อมูล</div>`;
                }
            }
            return html;
        }

        // ── Attach tooltip to a seat element ─────────────────────────────
        function attachTooltip(seatEl, district, province, getScoresFn) {
            seatEl.addEventListener('mouseenter', () => {
                const scores = getScoresFn();
                tooltip.innerHTML = buildBjtTooltip(district, province, scores);
                tooltip.style.display = 'block';
            });
            seatEl.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }

        // ── Render constituency view (seat dots) ─────────────────────────
        function renderConstituency(mapContainer) {
            buildConstituencyScores();
            mapContainer.innerHTML = '';
            Object.keys(provincesData).forEach(province => {
                const el = createProvinceEl(province);

                const seatsContainer = document.createElement('div');
                seatsContainer.className = 'seats-container';

                const sorted = [...provincesData[province]].sort((a, b) =>
                    parseInt(a.district) - parseInt(b.district));

                sorted.forEach(seat => {
                    const seatEl = document.createElement('div');
                    seatEl.className = 'seat';
                    seatEl.dataset.district = seat.district;
                    seatEl.textContent = seat.district;
                    seatEl.style.backgroundColor = getPartyColor(seat.party);
                    attachTooltip(seatEl, seat.district, province, () =>
                        (constituencyScores[province] || {})[seat.district] || []);
                    seatEl.addEventListener('click', () => {
                        window.highlightSidebarCard(province, seat.district);
                        if (window.zoomToProvinceDistrict) window.zoomToProvinceDistrict(province, seat.district);
                    });
                    seatsContainer.appendChild(seatEl);
                });

                el.appendChild(seatsContainer);
                mapContainer.appendChild(el);
            });
        }

        // ── Build partylist winners lookup (province → district → topParty) ──
        // ── Build partylist winners lookup (province → district → topParty) ──
        let partylistWinners = null; // lazy-built on first use
        let partylistScores = null;

        function buildPartylistWinners() {
            if (partylistWinners) return;
            partylistWinners = {}; // { province: { district: topParty } }
            partylistScores = {};

            const results = Papa.parse(partyListCsvData, {
                header: true,
                skipEmptyLines: true
            });

            // Aggregate votes per province+district+party
            const agg = {}; // "province|district" -> { party: votes }
            results.data.forEach(row => {
                let prov = row['จังหวัด'] || '';
                if (!prov || prov === 'UNKNOWN') return;
                // normalise province names
                if (['Bangkok', 'กรุงเทพ'].includes(prov)) prov = 'กรุงเทพมหานคร';
                if (prov === 'Sakon Nakhon') prov = 'สกลนคร';

                const dist  = row['เขต'] || '';
                const party = row['พรรค'] || '';
                const votes = parseInt(row['คะแนน']) || 0;
                const key   = `${prov}|${dist}`;
                if (!party) return;
                if (!agg[key]) agg[key] = {};
                agg[key][party] = (agg[key][party] || 0) + votes;
            });

            Object.entries(agg).forEach(([key, tally]) => {
                const [prov, dist] = key.split('|');
                
                const sorted = Object.entries(tally)
                    .map(([party, votes]) => ({ party, votes, name: "บัญชีรายชื่อ" }))
                    .sort((a, b) => b.votes - a.votes);

                if (!partylistScores[prov]) partylistScores[prov] = {};
                partylistScores[prov][dist] = sorted;

                const top = sorted[0];
                if (!top) return;
                if (!partylistWinners[prov]) partylistWinners[prov] = {};
                partylistWinners[prov][dist] = top.party;
            });
        }

        // ── Render partylist view (same dots+numbers as constituency) ─────
        function renderPartylist(mapContainer) {
            buildPartylistWinners();
            mapContainer.innerHTML = '';
            Object.keys(provincesData).forEach(province => {
                const el = createProvinceEl(province);

                const seatsContainer = document.createElement('div');
                seatsContainer.className = 'seats-container';

                // Use same district list as constituency, sorted by district number
                const sorted = [...provincesData[province]].sort((a, b) =>
                    parseInt(a.district) - parseInt(b.district));

                sorted.forEach(seat => {
                    const plParty = (partylistWinners[province] || {})[seat.district]
                                    || seat.party;
                    const seatEl = document.createElement('div');
                    seatEl.className = 'seat';
                    seatEl.dataset.district = seat.district;
                    seatEl.textContent = seat.district;
                    seatEl.style.backgroundColor = getPartyColor(plParty);
                    // Partylist tooltip uses partylist scores
                    attachTooltip(seatEl, seat.district, province, () => {
                        return (partylistScores && partylistScores[province] && partylistScores[province][seat.district]) || [];
                    });
                    seatEl.addEventListener('click', () => {
                        window.highlightSidebarCard(province, seat.district);
                        if (window.zoomToProvinceDistrict) window.zoomToProvinceDistrict(province, seat.district);
                    });
                    seatsContainer.appendChild(seatEl);
                });

                el.appendChild(seatsContainer);
                mapContainer.appendChild(el);
            });
        }

        // ── Helper: create province shell element ─────────────────────────
        function createProvinceEl(province) {
            const el = document.createElement('div');
            el.className = 'province';
            el.dataset.province = province;

            const gridPos = provinceGrid[province] || [1, 1];
            el.style.gridRow = gridPos[0];
            el.style.gridColumn = province === 'กรุงเทพมหานคร'
                ? `${gridPos[1]} / span 3`
                : province === 'นครราชสีมา'
                    ? `${gridPos[1]} / span 2`
                    : gridPos[1];

            const nameEl = document.createElement('div');
            nameEl.className = 'province-name';
            nameEl.textContent = province;
            el.appendChild(nameEl);
            
            // Add click listener to zoom into the province
            el.addEventListener('click', (e) => {
                // Ignore clicks on seats, as they have their own click handler
                if (e.target.closest('.seat')) return;
                if (window.zoomToProvince) window.zoomToProvince(province);
            });
            
            return el;
        }

        // ── Public toggle function (called from HTML buttons) ─────────────
        function setView(view) {
            currentView = view;
            const mapContainer = document.getElementById('map-container');
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(`btn-${view}`).classList.add('active');
            if (view === 'constituency') renderConstituency(mapContainer);
            else renderPartylist(mapContainer);
            // Re-apply any active filter after re-render
            if (activeFilter === 'margin') applyMarginFilter();
            
            // Re-apply main map region filter
            const regionSelector = document.getElementById('sidebar-region');
            if (regionSelector) {
                filterMainMapByRegion(regionSelector.value);
            }
        }

        // ── Filter state ──────────────────────────────────────────────────
        let activeFilter = null;
        let activeMarginThreshold = null;
        let closeRaceSet = null; // Set of "province|district" keys

        function buildCloseRaceSet(threshold) {
            buildConstituencyScores();
            if (typeof buildPartylistWinners === "function") buildPartylistWinners();
            
            closeRaceSet = new Set();

            const scoresData = (currentView === 'partylist') ? partylistScores : constituencyScores;
            if (!scoresData) return;

            Object.entries(scoresData).forEach(([province, districts]) => {
                Object.entries(districts).forEach(([district, scores]) => {
                    if (!scores || scores.length < 2) return;

                    const focusIdx = scores.findIndex(s => s.party === FOCUS_PARTY);
                    if (focusIdx === -1) return; // ไม่พบพรรคประชาชน

                    // Total votes = sum of all candidates
                    const total = scores.reduce((sum, s) => sum + s.votes, 0);
                    if (total === 0) return;

                    let gap = 0;
                    if (focusIdx === 0) {
                        // ถ้าพรรคประชาชนได้ที่ 1 เทียบกับที่ 2
                        gap = scores[0].votes - scores[1].votes;
                    } else {
                        // ถ้าพรรคประชาชนไม่ได้ที่ 1 เทียบกับที่ 1
                        gap = scores[0].votes - scores[focusIdx].votes;
                    }

                    const gapPct = gap / total;

                    if (gapPct < threshold) {
                        closeRaceSet.add(`${province}|${district}`);
                    }
                });
            });
        }

        function toggleMarginFilter(value) {
            if (!value) {
                clearFilter();
                return;
            }
            activeFilter = 'margin';
            activeMarginThreshold = parseFloat(value);
            document.getElementById('margin-slicer').classList.add('active');
            document.getElementById('filter-clear').style.display = 'inline-flex';
            applyMarginFilter();
        }

        function clearFilter() {
            activeFilter = null;
            activeMarginThreshold = null;
            
            const slicer = document.getElementById('margin-slicer');
            if (slicer) {
                slicer.value = "";
                slicer.classList.remove('active');
            }
            
            document.getElementById('filter-clear').style.display = 'none';
            document.querySelectorAll('.seat').forEach(s => {
                s.classList.remove('highlighted', 'dimmed');
            });
        }

        function applyMarginFilter() {
            if (activeFilter !== 'margin' || activeMarginThreshold === null) return;
            buildCloseRaceSet(activeMarginThreshold);
            document.querySelectorAll('.seat').forEach(seatEl => {
                const province = seatEl.closest('.province')?.dataset.province || '';
                const district = seatEl.textContent.trim();
                const key = `${province}|${district}`;
                if (closeRaceSet.has(key)) {
                    seatEl.classList.add('highlighted');
                    seatEl.classList.remove('dimmed');
                } else {
                    seatEl.classList.add('dimmed');
                    seatEl.classList.remove('highlighted');
                }
            });
        }

        Papa.parse(electionCsvData, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const data = results.data;
                const mapContainer = document.getElementById('map-container');
                const loading = document.getElementById('loading');

                if (!data || data.length === 0 || data[0]['จังหวัด'] === undefined) {
                    loading.innerHTML = '<span style="color:#ef4444;">ไม่พบข้อมูล ให้รัน/ตรวจสอบ embed_csv.py</span>';
                    return;
                }

                data.forEach(row => {
                    let province = row['จังหวัด'];
                    if (!province) return;
                    if (province === 'Sakon Nakhon') province = 'สกลนคร';
                    if (!provincesData[province]) provincesData[province] = [];
                    provincesData[province].push({
                        district: row['เขต'],
                        party:    row['พรรค'],
                        winner:   row['ผู้ชนะ']
                    });
                });

                loading.style.display = 'none';
                document.getElementById('main-layout').style.display = 'flex';
                document.getElementById('view-toggle').style.display = 'flex';
                document.getElementById('filter-bar').style.display = 'flex';
                mapContainer.style.display = 'grid';

                renderConstituency(mapContainer);

                window.currentPanzoom = null;
                if (typeof Panzoom !== 'undefined') {
                    // Determine dimensions to fit the map exactly
                    const wrapperW = mapContainer.parentElement.clientWidth || 800;
                    const wrapperH = mapContainer.parentElement.clientHeight || 600;
                    const mapW = mapContainer.offsetWidth || 1100;
                    const mapH = mapContainer.offsetHeight || 1500;

                    // Calculate a scale that fits the map within the viewport, leaving 3% margin
                    const scaleToFit = Math.min(wrapperW / mapW, wrapperH / mapH) * 0.97;
                    const defaultScale = Math.max(0.1, Math.min(scaleToFit, 1.5)); 
                    
                    // The flexbox of map-wrapper will automatically center the unscaled container.
                    // We only apply the scale; no manual translation required.
                    mapContainer.style.transformOrigin = 'center center';
                    
                    window.currentPanzoom = Panzoom(mapContainer, {
                        maxScale: 5,
                        minScale: 0.1,
                        startScale: defaultScale,
                        startX: 0,
                        startY: 0,
                        canvas: true,
                        cursor: 'grab'
                    });
                    
                    mapContainer.parentElement.addEventListener('wheel', function(e) {
                        e.preventDefault();
                        window.currentPanzoom.zoomWithWheel(e);
                    }, { passive: false });

                    // Connect Reset button
                    const btnReset = document.getElementById('reset-map-btn');
                    if (btnReset) {
                        btnReset.addEventListener('click', () => {
                            window.currentPanzoom.reset();
                            
                            document.querySelectorAll('#map-container .seat').forEach(s => {
                                s.classList.remove('dimmed');
                                s.classList.remove('highlighted');
                            });
                            
                            // Let's also restore the full map filter on reset!
                            const rs = document.getElementById('sidebar-region');
                            if (rs) { rs.value = 'all'; }
                            const so = document.getElementById('sidebar-sort');
                            if (so) { renderSidebar(so.value); }
                            filterMainMapByRegion('all');
                        });
                    }
                }

                // ── Build sidebar ranking ──
                buildSidebarRanking();

                // ── Build the Silent Gap section ──
                buildGapSection();
            },
            error: function(err) {
                console.error(err);
                document.getElementById('loading').innerHTML = `<span style="color:#ef4444;">เกิดข้อผิดพลาด: ${err}</span>`;
            }
        });

        // ── Sidebar Ranking Logic ─────────────────────────────────────────
        function partyHex(name) { return PARTY_HEX[name] || '#64748b'; }

        function buildDistrictInfoMap() {
            const info = {};
            const results = Papa.parse(electionCsvData, { header: true, skipEmptyLines: true });
            results.data.forEach(row => {
                let prov = row['จังหวัด'] || '';
                if (!prov) return;
                if (prov === 'Bangkok') prov = 'กรุงเทพมหานคร';
                if (prov === 'Sakon Nakhon') prov = 'สกลนคร';
                const dist = row['เขต'] || '';
                info[`${prov}|${dist}`] = {
                    eligible: parseInt(row['ผู้มีสิทธิ']) || 0,
                    voted: parseInt(row['มาใช้สิทธิ']) || 0,
                    valid: parseInt(row['คะแนนดี']) || 0
                };
            });
            return info;
        }

        // _districtInfoMap declared at top

        function getDistrictInfoMap() {
            if (!_districtInfoMap) _districtInfoMap = buildDistrictInfoMap();
            return _districtInfoMap;
        }

        function computeTargets(focusParty) {
            buildConstituencyScores();
            const di = getDistrictInfoMap();
            const targets = [];

            Object.entries(constituencyScores).forEach(([prov, dists]) => {
                Object.entries(dists).forEach(([dist, sorted]) => {
                    const rankIdx = sorted.findIndex(s => s.party === focusParty);
                    if (rankIdx === -1) return;

                    const focusD = sorted[rankIdx];
                    let rival, marginVotes, status;

                    if (rankIdx === 0) {
                        status = 'defend';
                        rival = sorted.length > 1 ? sorted[1] : null;
                        marginVotes = rival ? focusD.votes - rival.votes : Infinity;
                    } else {
                        status = 'attack';
                        rival = sorted[0];
                        marginVotes = rival.votes - focusD.votes;
                    }

                    if (!rival) return;

                    const key = `${prov}|${dist}`;
                    const info = di[key] || {};
                    const validVotes = info.valid || sorted.reduce((s, x) => s + x.votes, 0);
                    const marginPct = validVotes > 0 ? (marginVotes / validVotes * 100) : 0;
                    const turnoutPct = info.eligible > 0 ? (info.voted / info.eligible * 100) : 0;

                    targets.push({
                        prov, dist, status, rank: rankIdx + 1,
                        focusVotes: focusD.votes, rivalParty: rival.party, rivalVotes: rival.votes,
                        marginVotes, marginPct, turnoutPct
                    });
                });
            });
            return targets;
        }

        function renderSidebar(sortOrder) {
            const region = document.getElementById('sidebar-region').value;
            const focusParty = FOCUS_PARTY; // ใช้ค่าคงที่จากด้านบน
            const targets = computeTargets(focusParty);

            // Filter by region
            let filtered = targets;
            if (region !== 'all') {
                const provList = REGION_MAP[region] || [];
                filtered = targets.filter(t => provList.includes(t.prov));
            }

            // Sort
            filtered.sort((a, b) => {
                const catA = a.rank === 2 ? 0 : (a.rank === 1 ? 1 : 2);
                const catB = b.rank === 2 ? 0 : (b.rank === 1 ? 1 : 2);
                if (catA !== catB) return catA - catB;
                return a.marginPct - b.marginPct;
            });

            let list = filtered;
            if (sortOrder === 'hardest') list = filtered.slice().reverse();

            const container = document.getElementById('sidebar-list');
            const fmt = n => n.toLocaleString('th-TH');

            if (list.length === 0) {
                container.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;font-size:0.85rem;">ไม่พบเขตเป้าหมายในภาคนี้</div>';
                return;
            }

            container.innerHTML = list.map((t, i) => {
                const maxV = Math.max(t.focusVotes, t.rivalVotes);
                const fw = maxV > 0 ? (t.focusVotes / maxV * 100) : 0;
                const rw = maxV > 0 ? (t.rivalVotes / maxV * 100) : 0;
                const cls = t.status === 'defend' ? 'defend' : 'attack';

                return `<div class="sb-card" data-prov="${t.prov}" data-dist="${t.dist}" onclick="window.zoomToProvinceDistrict('${t.prov}', '${t.dist}')" style="cursor: pointer;">
                    <div class="sb-card-top">
                        <div class="sb-rank ${cls}">${i + 1}</div>
                        <div class="sb-info">
                            <div class="sb-title">${t.prov} เขต ${t.dist}</div>
                            <div class="sb-meta">${t.status === 'defend' ? '🛡️ ป้องกัน' : '⚔️ พลิก'} · อันดับ ${t.rank}</div>
                        </div>
                        <div class="sb-badges">
                            <span class="sb-badge margin">${t.marginPct.toFixed(1)}%</span>
                            <span class="sb-badge turnout">TO ${t.turnoutPct.toFixed(0)}%</span>
                        </div>
                    </div>
                    <div class="sb-bars">
                        <div class="sb-bar-row">
                            <span class="sb-bar-name">${focusParty}</span>
                            <div class="sb-bar-track">
                                <div class="sb-bar-fill" style="width:${fw}%; background:${partyHex(focusParty)}">${fmt(t.focusVotes)}</div>
                            </div>
                        </div>
                        <div class="sb-bar-row">
                            <span class="sb-bar-name">${t.rivalParty}</span>
                            <div class="sb-bar-track">
                                <div class="sb-bar-fill" style="width:${rw}%; background:${partyHex(t.rivalParty)}">${fmt(t.rivalVotes)}</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        function buildSidebarRanking() {
            try {
                console.log('[Sidebar] Building ranking...');
                renderSidebar('easiest');
                console.log('[Sidebar] Rendered successfully.');
                document.getElementById('sidebar-sort').addEventListener('change', function() {
                    renderSidebar(this.value);
                });
                document.getElementById('sidebar-region').addEventListener('change', function() {
                    renderSidebar(document.getElementById('sidebar-sort').value);
                    filterMainMapByRegion(this.value);
                });
            } catch (e) {
                console.error('[Sidebar] Error building ranking:', e);
                document.getElementById('sidebar-list').innerHTML =
                    '<div style="padding:16px;color:#ef4444;font-size:0.8rem;">Error: ' + e.message + '</div>';
            }
        }

        function filterMainMapByRegion(region, skipCenter = false) {
            const provList = region === 'all' ? null : (REGION_MAP[region] || []);
            document.querySelectorAll('#map-container .province').forEach(el => {
                const prov = el.dataset.province;
                if (!provList || provList.includes(prov)) {
                    el.style.display = 'flex';
                } else {
                    el.style.display = 'none';
                }
            });
            if (!skipCenter) {
                setTimeout(centerVisibleProvinces, 50);
            }
        }

        function centerVisibleProvinces() {
            if (!window.currentPanzoom) return;
            const container = document.getElementById('map-container');
            const region = document.getElementById('sidebar-region').value;
            
            if (region === 'all') {
                const wrapperW = container.parentElement.clientWidth || 800;
                const wrapperH = container.parentElement.clientHeight || 600;
                const mapW = container.offsetWidth || 1100;
                const mapH = container.offsetHeight || 1500;
                const scaleToFit = Math.min(wrapperW / mapW, wrapperH / mapH) * 0.97;
                window.currentPanzoom.pan(0, 0, { animate: true, force: true });
                window.currentPanzoom.zoom(Math.max(0.1, Math.min(scaleToFit, 1.5)), { animate: true });
                return;
            }

            const wrapperW = container.parentElement.clientWidth;
            const wrapperH = container.parentElement.clientHeight;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let hasVisible = false;

            document.querySelectorAll('#map-container .province').forEach(el => {
                if (el.style.display !== 'none') {
                    hasVisible = true;
                    // Because Panzoom scales the parent, offsetLeft is unscaled!
                    const x = el.offsetLeft;
                    const y = el.offsetTop;
                    const w = el.offsetWidth;
                    const h = el.offsetHeight;
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x + w > maxX) maxX = x + w;
                    if (y + h > maxY) maxY = y + h;
                }
            });

            if (!hasVisible) return;

            const viewW = maxX - minX;
            const viewH = maxY - minY;

            // Target scale with a margin so it isn't squeezed to the absolute edge
            let targetScale = Math.min(wrapperW / viewW, wrapperH / viewH) * 0.85;
            targetScale = Math.max(0.1, Math.min(targetScale, 2.8)); 

            const centerX = minX + viewW / 2;
            const centerY = minY + viewH / 2;

            const mapW = container.offsetWidth;
            const mapH = container.offsetHeight;
            const mapCenterX = mapW / 2;
            const mapCenterY = mapH / 2;

            const translateX = mapCenterX - centerX;
            const translateY = mapCenterY - centerY;

            window.currentPanzoom.pan(translateX, translateY, { animate: true, force: true });
            window.currentPanzoom.zoom(targetScale, { animate: true });
        }

        // ── The Silent Gap Logic ──────────────────────────────────────────
        var _gapTargets = null;
        function getGapTargets() {
            if (_gapTargets) return _gapTargets;
            buildConstituencyScores();
            buildPartylistWinners(); // ensures partylistScores is available
            
            _gapTargets = [];

            Object.keys(provincesData).forEach(prov => {
                const districts = provincesData[prov];
                districts.forEach(seat => {
                    const dist = seat.district;
                    // Get partylist votes for the focus party
                    const plScores = (partylistScores[prov] && partylistScores[prov][dist]) || [];
                    const plFocus = plScores.find(s => s.party === FOCUS_PARTY);
                    
                    // Get constituency votes
                    const csScores = (constituencyScores[prov] && constituencyScores[prov][dist]) || [];
                    const csFocus = csScores.find(s => s.party === FOCUS_PARTY);
                    const csWinner = csScores[0];
                    
                    if (!plFocus || !csFocus || !csWinner) return;

                    // Condition: People love the party (Focus party is #1 in partylist)
                    // but they rejected the candidate (Focus party is NOT #1 in constituency)
                    const plWinner = plScores[0];
                    if (plWinner.party === FOCUS_PARTY && csWinner.party !== FOCUS_PARTY) {
                        const plVotes = plFocus.votes;
                        const csVotes = csFocus.votes;
                        const gap = plVotes - csVotes;
                        
                        // We only care if gap > 0 to be technically "missing" votes, 
                        // but actually just winning PL and losing CS is already the required condition.
                        
                        _gapTargets.push({
                            prov, dist, gap,
                            plVotes, csVotes,
                            csWinnerParty: csWinner.party,
                            csWinnerName: csWinner.name,
                            csWinnerVotes: csWinner.votes
                        });
                    }
                });
            });

            _gapTargets.sort((a, b) => b.gap - a.gap);
            return _gapTargets;
        }

        function renderGapSidebar() {
            const region = document.getElementById('gap-region').value;
            const targets = getGapTargets();
            
            let filtered = targets;
            if (region !== 'all') {
                const provList = REGION_MAP[region] || [];
                filtered = targets.filter(t => provList.includes(t.prov));
            }
            
            const container = document.getElementById('gap-sidebar-list');
            const fmt = n => n.toLocaleString('th-TH');

            if (filtered.length === 0) {
                container.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;font-size:0.85rem;">ไม่พบเขตที่เข้าเกณฑ์ในภาคนี้</div>';
                return;
            }

            container.innerHTML = filtered.map((t, i) => {
                const maxV = Math.max(t.plVotes, t.csVotes);
                const plW = maxV > 0 ? (t.plVotes / maxV * 100) : 0;
                const csW = maxV > 0 ? (t.csVotes / maxV * 100) : 0;

                return `<div class="sb-card" data-prov="${t.prov}" data-dist="${t.dist}" onclick="window.highlightWaffleCell('${t.prov}', '${t.dist}')" style="border-left: 4px solid #ea580c; cursor: pointer;">
                    <div class="sb-card-top">
                        <div class="sb-rank" style="background:#fff7ed; color:#ea580c; border: 1px solid #ffedd5;">${i + 1}</div>
                        <div class="sb-info">
                            <div class="sb-title">${t.prov} เขต ${t.dist}</div>
                            <div class="sb-meta">ผู้ชนะเขต: ${t.csWinnerName} (${t.csWinnerParty})</div>
                        </div>
                        <div class="sb-badges">
                            <span class="sb-badge" style="background:#fee2e2; color:#ef4444; border: 1px solid #fecaca; box-shadow: none;">Gap ${fmt(t.gap)}</span>
                        </div>
                    </div>
                    <div class="sb-bars">
                        <div class="sb-bar-row">
                            <span class="sb-bar-name" style="width: 80px;">พรรค</span>
                            <div class="sb-bar-track">
                                <div class="sb-bar-fill" style="width:${plW}%; background:#ea580c">${fmt(t.plVotes)}</div>
                            </div>
                        </div>
                        <div class="sb-bar-row">
                            <span class="sb-bar-name" style="width: 80px;">ผู้สมัคร สส.</span>
                            <div class="sb-bar-track">
                                <div class="sb-bar-fill" style="width:${csW}%; background:#cbd5e1; color:#475569; text-shadow:none;">${fmt(t.csVotes)}</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            // Re-render map to match region filter if needed
            renderGapMap(filtered);
            
            // Explicitly show the section when there is content
            const section = document.getElementById('gap-section');
            if (section) section.style.display = 'block';
        }

        // Custom tooltip for Gap Map
        const gapTooltip = document.createElement('div');
        gapTooltip.id = 'gap-tooltip';
        gapTooltip.style.position = 'absolute';
        gapTooltip.style.background = '#0f172a';
        gapTooltip.style.color = '#f8fafc';
        gapTooltip.style.padding = '12px 14px';
        gapTooltip.style.borderRadius = '10px';
        gapTooltip.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
        gapTooltip.style.fontSize = '0.85rem';
        gapTooltip.style.lineHeight = '1.5';
        gapTooltip.style.pointerEvents = 'none';
        gapTooltip.style.zIndex = '1000';
        gapTooltip.style.display = 'none';
        gapTooltip.style.minWidth = '220px';
        gapTooltip.style.border = '1px solid #334155';
        document.body.appendChild(gapTooltip);

        function attachGapTooltip(seatEl, district, province, t) {
            seatEl.addEventListener('mouseenter', () => {
                const fmt = n => n.toLocaleString('th-TH');
                gapTooltip.innerHTML = `
                    <div style="font-weight:700;margin-bottom:8px;color:#f97316;border-bottom:1px solid #334155;padding-bottom:6px;">⚠️ ${province} เขต ${district}</div>
                    <div style="display:flex; justify-content:space-between;"><span>คะแนนพรรค:</span> <b style="color:#fbbf24">${fmt(t.plVotes)}</b></div>
                    <div style="display:flex; justify-content:space-between;"><span>คะแนน สส.:</span> <b style="color:#94a3b8">${fmt(t.csVotes)}</b></div>
                    <div style="display:flex; justify-content:space-between; margin-top:6px; padding-top:6px; border-top:1px dashed #334155;">
                        <span style="color:#f87171;">Gap สูญเสีย:</span> <b style="color:#ef4444;">${fmt(t.gap)}</b>
                    </div>
                    <div style="margin-top:8px;color:#94a3b8;font-size:0.75rem">ผู้ชนะเขต:<br>${t.csWinnerName} (${t.csWinnerParty})</div>
                `;
                gapTooltip.style.display = 'block';
            });
            seatEl.addEventListener('mouseleave', () => {
                gapTooltip.style.display = 'none';
            });
            seatEl.addEventListener('mousemove', (e) => {
                gapTooltip.style.left = e.pageX + 15 + 'px';
                gapTooltip.style.top = e.pageY + 15 + 'px';
            });
        }

        function renderGapMap(filteredTargets) {
            // Now handled by renderWaffleChart
        }

        // ── Waffle Chart Data ─────────────────────────────────────────────
        function getWaffleData() {
            buildConstituencyScores();
            buildPartylistWinners();

            const wonBoth = [];
            const silentGap = [];

            Object.keys(provincesData).forEach(prov => {
                provincesData[prov].forEach(seat => {
                    const dist = seat.district;
                    const plScores = (partylistScores[prov] && partylistScores[prov][dist]) || [];
                    const csScores = (constituencyScores[prov] && constituencyScores[prov][dist]) || [];
                    const plWinner = plScores[0];
                    const csWinner = csScores[0];
                    const plFocus = plScores.find(s => s.party === FOCUS_PARTY);
                    const csFocus = csScores.find(s => s.party === FOCUS_PARTY);

                    if (!plWinner || !csWinner || !plFocus || !csFocus) return;
                    if (plWinner.party !== FOCUS_PARTY) return;

                    const item = {
                        prov, dist,
                        plVotes: plFocus.votes,
                        csVotes: csFocus.votes,
                        csWinnerParty: csWinner.party,
                        csWinnerName: csWinner.name || '',
                        gap: plFocus.votes - csFocus.votes
                    };

                    if (csWinner.party === FOCUS_PARTY) {
                        wonBoth.push(item);
                    } else {
                        silentGap.push(item);
                    }
                });
            });

            silentGap.sort((a, b) => b.gap - a.gap);
            wonBoth.sort((a, b) => a.prov.localeCompare(b.prov) || parseInt(a.dist) - parseInt(b.dist));
            return { wonBoth, silentGap };
        }

        // ── Render Waffle Chart ───────────────────────────────────────────
        function renderWaffleChart(regionFilter) {
            const grid = document.getElementById('waffle-grid');
            const summaryEl = document.getElementById('waffle-summary');
            if (!grid) return;

            const data = getWaffleData();
            const region = regionFilter || 'all';
            const provList = region !== 'all' ? (REGION_MAP[region] || []) : null;
            const filterFn = item => !provList || provList.includes(item.prov);

            const wonFiltered = data.wonBoth.filter(filterFn);
            const gapFiltered = data.silentGap.filter(filterFn);
            const total = wonFiltered.length + gapFiltered.length;

            grid.innerHTML = '';

            if (total === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:#94a3b8;">ไม่พบเขตที่เข้าเกณฑ์</div>';
                if (summaryEl) summaryEl.innerHTML = '';
                return;
            }

            // Green first, then orange
            const allItems = [
                ...wonFiltered.map(d => ({ ...d, type: 'won' })),
                ...gapFiltered.map(d => ({ ...d, type: 'gap' }))
            ];

            allItems.forEach(item => {
                const cell = document.createElement('div');
                cell.className = `waffle-cell ${item.type}`;
                cell.dataset.province = item.prov;
                cell.dataset.district = item.dist;
                cell.addEventListener('click', () => window.highlightGapSidebarCard(item.prov, item.dist));

                // Tooltip
                cell.addEventListener('mouseenter', (e) => {
                    const fmt = n => n.toLocaleString('th-TH');
                    const color = item.type === 'won' ? '#34d399' : '#f97316';
                    let html = `<div style="font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid #334155;color:${color}">📍 ${item.prov} เขต ${item.dist}</div>`;
                    html += `<div style="display:flex;justify-content:space-between;gap:16px"><span>คะแนนพรรค (PL):</span> <b style="color:#fbbf24">${fmt(item.plVotes)}</b></div>`;
                    html += `<div style="display:flex;justify-content:space-between;gap:16px"><span>คะแนน สส. (เขต):</span> <b style="color:#94a3b8">${fmt(item.csVotes)}</b></div>`;
                    if (item.type === 'gap') {
                        html += `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed #334155;display:flex;justify-content:space-between"><span style="color:#f87171">Gap สูญเสีย:</span> <b style="color:#ef4444">${fmt(item.gap)}</b></div>`;
                        html += `<div style="margin-top:6px;color:#94a3b8;font-size:0.75rem">ผู้ชนะเขต: ${item.csWinnerName} (${item.csWinnerParty})</div>`;
                    } else {
                        html += `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed #334155;color:#34d399;font-size:0.78rem">✅ ชนะทั้งบัญชีรายชื่อและเขต</div>`;
                    }
                    gapTooltip.innerHTML = html;
                    gapTooltip.style.display = 'block';
                    gapTooltip.style.left = e.pageX + 15 + 'px';
                    gapTooltip.style.top = e.pageY + 15 + 'px';
                });
                cell.addEventListener('mouseleave', () => gapTooltip.style.display = 'none');
                cell.addEventListener('mousemove', (e) => {
                    gapTooltip.style.left = e.pageX + 15 + 'px';
                    gapTooltip.style.top = e.pageY + 15 + 'px';
                });

                grid.appendChild(cell);
            });

            // Summary + Legend
            if (summaryEl) {
                const pct = total > 0 ? (gapFiltered.length / total * 100).toFixed(1) : 0;
                summaryEl.innerHTML = `
                    <div class="waffle-stat"><span class="waffle-legend" style="background:#16a34a;"></span> ชนะทั้งคู่: <strong style="color:#16a34a;">${wonFiltered.length}</strong></div>
                    <div class="waffle-stat"><span class="waffle-legend" style="background:#ea580c;"></span> Silent Gap: <strong style="color:#ea580c;">${gapFiltered.length}</strong></div>
                    <div class="waffle-stat">📊 รวม: <strong>${total}</strong> เขต</div>
                    <div class="waffle-stat">📈 อัตราสูญเสีย: <strong style="color:#ea580c;">${pct}%</strong></div>
                `;
            }

            document.getElementById('gap-section').style.display = 'block';
        }

        function buildGapSection() {
            try {
                console.log('[Gap] Building gap section...');
                renderGapSidebar();
                renderWaffleChart('all');

                document.getElementById('gap-region').addEventListener('change', function() {
                    const val = this.value;
                    renderGapSidebar();
                    renderWaffleChart(val);
                });
            } catch (e) {
                console.error('[Gap] Error:', e);
                const section = document.getElementById('gap-section');
                if (section) section.style.display = 'block';
                const list = document.getElementById('gap-sidebar-list');
                if (list) list.innerHTML = `<div style="padding:20px; color:#ef4444;">Error in Gap Logic: ${e.message}</div>`;
            }
        }

        window.highlightWaffleCell = function(prov, dist) {
            document.getElementById('gap-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            document.querySelectorAll('#waffle-grid .waffle-cell').forEach(c => {
                c.style.outline = '';
                c.style.transform = '';
                c.style.zIndex = '';
                c.style.boxShadow = '';
            });

            const targetCell = document.querySelector(`#waffle-grid .waffle-cell[data-province="${prov}"][data-district="${dist}"]`);
            if (targetCell) {
                targetCell.style.outline = '4px solid #3b82f6';
                targetCell.style.boxShadow = '0 0 15px 5px rgba(59, 130, 246, 0.6)';
                targetCell.style.transform = 'scale(1.5)';
                targetCell.style.zIndex = '100';
                targetCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.zoomToProvinceDistrict = function(prov, dist) {
            if (!window.currentPanzoom) return;
            
            const mapContainer = document.getElementById('map-container');
            const provEl = mapContainer.querySelector(`.province[data-province="${prov}"]`);
            if (!provEl) return;

            document.getElementById('main-layout').scrollIntoView({ behavior: 'smooth', block: 'center' });

            document.querySelectorAll('#map-container .seat').forEach(s => {
                s.classList.add('dimmed');
                s.classList.remove('highlighted');
            });
            
            const targetSeat = provEl.querySelector(`.seat[data-district="${dist}"]`);
            
            // Un-dim all seats in the selected province so they remain normally colored
            provEl.querySelectorAll('.seat').forEach(s => s.classList.remove('dimmed'));
            
            // Highlight the target seat specifically
            if (targetSeat) {
                targetSeat.classList.add('highlighted');
            }

            const rs = document.getElementById('sidebar-region');
            if (rs && rs.value !== 'all') {
                rs.value = 'all';
                filterMainMapByRegion('all', true);
            }

            setTimeout(() => {
                const wrapperW = mapContainer.parentElement.clientWidth;
                const wrapperH = mapContainer.parentElement.clientHeight;
                const x = provEl.offsetLeft;
                const y = provEl.offsetTop;
                const w = provEl.offsetWidth;
                const h = provEl.offsetHeight;
                
                let targetScale = 3.5; 
                const centerX = x + w / 2;
                const centerY = y + h / 2;
                const mapCenterX = mapContainer.offsetWidth / 2;
                const mapCenterY = mapContainer.offsetHeight / 2;
                
                const translateX = mapCenterX - centerX;
                const translateY = mapCenterY - centerY;
                
                window.currentPanzoom.pan(translateX, translateY, { animate: true, force: true });
                window.currentPanzoom.zoom(targetScale, { animate: true });
            }, 60);
        };

        window.zoomToProvince = function(prov) {
            if (!window.currentPanzoom) return;
            
            const mapContainer = document.getElementById('map-container');
            const provEl = mapContainer.querySelector(`.province[data-province="${prov}"]`);
            if (!provEl) return;

            document.getElementById('main-layout').scrollIntoView({ behavior: 'smooth', block: 'center' });

            const rs = document.getElementById('sidebar-region');
            if (rs && rs.value !== 'all') {
                rs.value = 'all';
                filterMainMapByRegion('all', true);
            }

            setTimeout(() => {
                const x = provEl.offsetLeft;
                const y = provEl.offsetTop;
                const w = provEl.offsetWidth;
                const h = provEl.offsetHeight;
                
                let targetScale = 3.5; 
                const centerX = x + w / 2;
                const centerY = y + h / 2;
                const mapCenterX = mapContainer.offsetWidth / 2;
                const mapCenterY = mapContainer.offsetHeight / 2;
                
                const translateX = mapCenterX - centerX;
                const translateY = mapCenterY - centerY;
                
                window.currentPanzoom.pan(translateX, translateY, { animate: true, force: true });
                window.currentPanzoom.zoom(targetScale, { animate: true });
            }, 60);
        };

        window.highlightSidebarCard = function(prov, dist) {
            const sidebar = document.getElementById('sidebar-list');
            if (!sidebar) return;
            
            sidebar.querySelectorAll('.sb-card').forEach(c => {
                c.style.borderColor = '';
                c.style.transform = '';
                c.style.boxShadow = '';
            });
            
            const card = sidebar.querySelector(`.sb-card[data-prov="${prov}"][data-dist="${dist}"]`);
            if (card) {
                card.style.borderColor = '#3b82f6';
                card.style.transform = 'translateY(-1px)';
                card.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.highlightGapSidebarCard = function(prov, dist) {
            const sidebar = document.getElementById('gap-sidebar-list');
            if (!sidebar) return;

            sidebar.querySelectorAll('.sb-card').forEach(c => {
                c.style.outline = 'none';
                c.style.transform = '';
            });

            const card = sidebar.querySelector(`.sb-card[data-prov="${prov}"][data-dist="${dist}"]`);
            if (card) {
                card.style.outline = '2px solid #3b82f6';
                card.style.outlineOffset = '1px';
                card.style.transform = 'translateY(-1px)';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };