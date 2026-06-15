        let currentMode = 'gpa';
        let lastCalcData = null;

        // FIX: Added W (-1) and SA (-2) to grade label map
        const gradeLabel = { 10:'O', 9:'A+', 8:'A', 7:'B+', 6:'B', 5:'C', 0:'U', '-1':'W', '-2':'SA' };

        // Helper: returns the display string for a numeric grade value
        function gradeStr(g) { return gradeLabel[g] !== undefined ? gradeLabel[g] : String(g); }

        // Helper: is this grade a fail/exclude grade?
        function isFailed(grade) { return grade <= 0; }

        // ── Curriculum data ──────────────────────────────────────────────
        const semesterData = {
            1: [
                { code:"HS3152", name:"Professional English - I",                   credits:3   },
                { code:"MA3151", name:"Matrices and Calculus",                       credits:4   },
                { code:"PH3151", name:"Engineering Physics",                         credits:3   },
                { code:"CY3151", name:"Engineering Chemistry",                       credits:3   },
                { code:"GE3151", name:"Problem Solving and Python Programming",      credits:3   },
                { code:"GE3152", name:"Heritage of Tamils",                          credits:1   },
                { code:"GE3171", name:"Problem Solving and Python Lab",              credits:2   },
                { code:"BS3171", name:"Physics and Chemistry Lab",                   credits:2   },
                { code:"GE3172", name:"English Laboratory",                          credits:1   }
            ],
            2: [
                { code:"HS3252", name:"Professional English - II",                  credits:2   },
                { code:"MA3251", name:"Statistics and Numerical Methods",            credits:4   },
                { code:"PH3202", name:"Physics for Electrical Engineering",          credits:3   },
                { code:"BE3255", name:"Basic Civil and Mechanical Engineering",      credits:3   },
                { code:"GE3251", name:"Engineering Graphics",                        credits:4   },
                { code:"EE3251", name:"Electric Circuit Analysis",                   credits:4   },
                { code:"GE3252", name:"Tamils and Technology",                       credits:1   },
                { code:"GE3271", name:"Engineering Practices Lab",                   credits:2   },
                { code:"EE3271", name:"Electric Circuits Laboratory",                credits:2   },
                { code:"GE3272", name:"Communication Lab",                           credits:2   }
            ],
            3: [
                { code:"MA3303", name:"Probability and Complex Functions",           credits:4   },
                { code:"EE3301", name:"Electromagnetic Fields",                      credits:4   },
                { code:"EE3302", name:"Digital Logic Circuits",                      credits:3   },
                { code:"EC3301", name:"Electron Devices and Circuits",               credits:3   },
                { code:"EE3303", name:"Electrical Machines - I",                     credits:3   },
                { code:"CS3353", name:"C Programming and Data Structures",           credits:3   },
                { code:"EC3311", name:"Electronic Devices and Circuits Lab",         credits:1.5 },
                { code:"EE3311", name:"Electrical Machines Laboratory - I",          credits:1.5 },
                { code:"CS3362", name:"C Programming and Data Structures Lab",       credits:1.5 },
                { code:"GE3361", name:"Professional Development",                    credits:1   }
            ],
            4: [
                { code:"GE3451", name:"Environmental Sciences",                      credits:2   },
                { code:"EE3401", name:"Transmission and Distribution",               credits:3   },
                { code:"EE3402", name:"Linear Integrated Circuits",                  credits:3   },
                { code:"EE3403", name:"Measurements and Instrumentation",            credits:3   },
                { code:"EE3404", name:"Microprocessor and Microcontroller",          credits:3   },
                { code:"EE3405", name:"Electrical Machines - II",                    credits:3   },
                { code:"EE3411", name:"Electrical Machines Laboratory - II",         credits:1.5 },
                { code:"EE3412", name:"Linear and Digital Circuits Lab",             credits:1.5 },
                { code:"EE3413", name:"Microprocessor Lab",                          credits:1.5 }
            ],
            5: [
                { code:"EE3501", name:"Power System Analysis",                       credits:3   },
                { code:"EE3591", name:"Power Electronics",                           credits:3   },
                { code:"EE3503", name:"Control Systems",                             credits:3   },
                { code:"EE3006",  name:"Power Quality",                credits:3   },
                { code:"EE3007", name:"Smart Grid",               credits:3   },
                { code:"EE3028",name:"Design of Electric Vehicle Charging System",              credits:3   },
                { code:"EE3511", name:"Power Electronics Laboratory",                credits:1.5 },
                { code:"EE3512", name:"Control and Instrumentation Laboratory",      credits:2   }
            ],
            6: [
                { code:"EE3601", name:"Protection and Switchgear", credits:3   },
                { code:"EE3602", name:"Power System Operation and Control", credits:3   },
                { code:"OCS352", name:"IoT Concepts and Applications", credits:3   },
                { code:"EE3032", name:"Energy Storage Systems",  credits:3   },
                { code:"EE3033", name:"Hybrid Energy Technology", credits:3   },
                { code:"EE3037", name:"Power System Transients", credits:3   },
                { code:"EE3611", name:"Power System Laboratory", credits:1.5 }
            ],
            7: [
                { code:"EE3701",           name:"High Voltage Engineering",          credits:3   },
                { code:"GE3791",           name:"Human Values and Ethics",           credits:2   },
                { code:"GE3751", name:"Principles of Management",             credits:3   },
                { code:"OCS351", name:"Artificial intelligence & Machine learning Fundamentals",                  credits:3   },
                { code:"OHS352",name:"Project Report Writing",                 credits:3   },
                { code:"OHS351", name:"English for Competitive Examinations",                  credits:3   },
                { code:"EE3012",     name:"Electrical Drives",         credits:3   }
            ],
            8: [
                { code:"EE3811", name:"Project Work / Internship",                   credits:10  }
            ]
        };

        // ── Grade dropdown HTML (shared across all row types) ─────────────
        function gradeOptionsHTML(semAttr) {
            return `<select class="grade-select" ${semAttr}>
                        <option value="10" selected>O - 10</option>
                        <option value="9">A+ - 9</option>
                        <option value="8">A - 8</option>
                        <option value="7">B+ - 7</option>
                        <option value="6">B - 6</option>
                        <option value="5">C - 5</option>
                        <option value="0">U - Failed</option>
                        <option value="-1">W - Withdrawal</option>
                        <option value="-2">SA - Absent</option>
                    </select>`;
        }

        // ── Mode switching ────────────────────────────────────────────────
        function setMode(mode, evt) {
            currentMode = mode;
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            if (evt && evt.target) evt.target.classList.add('active');

            document.getElementById('semesterSelect').value = '';
            document.getElementById('semesterFrom').value = '';
            document.getElementById('semesterTo').value = '';
            document.getElementById('subjectGrid').innerHTML = '';
            document.getElementById('results').style.display = 'none';
            document.getElementById('exportSelector').style.display = 'none';
            document.getElementById('arrear-warning').style.display = 'none';
            lastCalcData = null;

            updateSemesterOptions();

            const btn = document.getElementById('calculateBtn');
            if (mode === 'cgpa') {
                btn.textContent = 'Calculate CGPA';
                document.getElementById('result-label').textContent = 'CGPA for selected range';
                document.getElementById('gpaSemesterSelector').style.display = 'none';
                document.getElementById('cgpaSemesterSelector').style.display = 'flex';
            } else {
                btn.textContent = 'Calculate GPA';
                document.getElementById('result-label').textContent = 'GPA for selected semester';
                document.getElementById('gpaSemesterSelector').style.display = 'block';
                document.getElementById('cgpaSemesterSelector').style.display = 'none';
            }
        }

        function updateSemesterOptions() {
            const sel = document.getElementById('semesterSelect');
            sel.innerHTML = '<option value="">Select Semester</option>';
            const from = document.getElementById('semesterFrom');
            const to   = document.getElementById('semesterTo');
            from.innerHTML = '<option value="">From Semester</option>';
            to.innerHTML   = '<option value="">To Semester</option>';
            for (let i = 1; i <= 8; i++) {
                sel.innerHTML  += `<option value="${i}">Semester ${i}</option>`;
                from.innerHTML += `<option value="${i}">Semester ${i}</option>`;
                to.innerHTML   += `<option value="${i}">Semester ${i}</option>`;
            }
        }

        function onRangeChange() {
            const from = parseInt(document.getElementById('semesterFrom').value);
            const to   = parseInt(document.getElementById('semesterTo').value);
            if (!from || !to) return;
            if (from > to) { alert('"From" semester cannot be greater than "To" semester.'); return; }
            loadCGPASubjects(from, to);
        }

        // ── Subject loaders ───────────────────────────────────────────────
        function loadSubjects() {
            const sem  = document.getElementById('semesterSelect').value;
            const grid = document.getElementById('subjectGrid');
            grid.innerHTML = '';
            if (!sem) return;
            loadSemesterSubjects(sem, grid, null);
        }

        function loadSemesterSubjects(semester, container, semNum) {
            if (!semesterData[semester]) return;
            semesterData[semester].forEach(subject => {
                const row = document.createElement('div');
                row.className = 'subject-row';
                const semAttr = semNum !== null ? `data-semester="${semNum}"` : '';
                row.innerHTML = `
                    <div class="subject-code">${subject.code} - ${subject.name}</div>
                    <div class="credit-display">${subject.credits} credits</div>
                    ${gradeOptionsHTML(semAttr)}
                `;
                container.appendChild(row);
            });

            const addBtn = document.createElement('button');
            addBtn.className = 'add-subject-btn';
            addBtn.innerHTML = '＋ Add Subject';
            addBtn.onclick = () => insertCustomSubjectRow(container, addBtn, semNum);
            container.appendChild(addBtn);
        }

        function loadCGPASubjects(fromSem, toSem) {
            const grid = document.getElementById('subjectGrid');
            grid.innerHTML = '';
            for (let sem = fromSem; sem <= toSem; sem++) {
                if (!semesterData[sem]) continue;
                const section  = document.createElement('div');
                section.className = 'semester-section';
                const titleDiv = document.createElement('div');
                titleDiv.className = 'semester-title';
                titleDiv.textContent = `Semester ${sem}`;
                section.appendChild(titleDiv);
                loadSemesterSubjects(sem, section, sem);
                grid.appendChild(section);
            }
        }

        function insertCustomSubjectRow(container, addBtn, semester) {
            const row = document.createElement('div');
            row.className = 'custom-subject-row';
            const semAttr = semester !== null ? `data-semester="${semester}"` : '';
            row.innerHTML = `
                <div class="custom-inputs">
                    <input type="text"   class="custom-name"    placeholder="Subject Name *" required />
                    <input type="text"   class="custom-code"    placeholder="Subject Code" />
                </div>
                <input type="number" class="custom-credits" placeholder="Credits *" min="0.5" max="10" step="0.5" required />
                ${gradeOptionsHTML(semAttr)}
                <button class="remove-subject-btn" title="Remove"
                    onclick="this.closest('.custom-subject-row').remove()">✕</button>
            `;
            container.insertBefore(row, addBtn);
            row.querySelector('.custom-name').focus();
        }

        // ── Calculation ───────────────────────────────────────────────────
        function calculate() {
            if (currentMode === 'gpa') calculateGPA(); else calculateCGPA();
        }

        function calculateGPA() {
            const rows = document.querySelectorAll('.subject-row, .custom-subject-row');
            let totalCredits = 0, totalGradePoints = 0;
            const subjectGrades = [];
            let hasError = false;

            rows.forEach(row => {
                let credits, name, code = '';
                if (row.classList.contains('custom-subject-row')) {
                    const ni = row.querySelector('.custom-name');
                    const ci = row.querySelector('.custom-credits');
                    ni.classList.remove('invalid'); ci.classList.remove('invalid');
                    const nv = ni.value.trim();
                    const cv = parseFloat(ci.value);
                    if (!nv) { ni.classList.add('invalid'); hasError = true; }
                    if (!ci.value || isNaN(cv) || cv <= 0) { ci.classList.add('invalid'); hasError = true; }
                    if (!nv || isNaN(cv) || cv <= 0) return;
                    credits = cv; name = nv;
                    code = row.querySelector('.custom-code').value.trim() || '—';
                } else {
                    const txt = row.querySelector('.subject-code').textContent;
                    credits = parseFloat(row.querySelector('.credit-display').textContent);
                    const parts = txt.split(' - ');
                    code = parts[0].trim(); name = parts.slice(1).join(' - ').trim();
                }
                const grade = parseFloat(row.querySelector('.grade-select').value);
                // For GPA: all enrolled subjects count in denominator; failed = 0 grade points
                const gp = Math.max(0, grade);
                totalCredits     += credits;
                totalGradePoints += credits * gp;
                subjectGrades.push({ code, name, grade, credits });
            });

            if (hasError) { alert('Please fill in Subject Name and Credits for all added subjects.'); return; }
            if (totalCredits === 0) { alert('No subjects found to calculate GPA.'); return; }

            const gpa = totalGradePoints / totalCredits;
            document.getElementById('gpa-result').textContent  = gpa.toFixed(2);
            document.getElementById('total-credits').textContent = totalCredits;
            document.getElementById('results').style.display   = 'block';
            document.getElementById('semester-gpa-breakdown').style.display = 'none';
            document.getElementById('arrear-warning').style.display = 'none';

            const semSel = document.getElementById('semesterSelect');
            lastCalcData = {
                mode: 'gpa',
                semesterLabel: semSel.options[semSel.selectedIndex].text,
                subjects: subjectGrades,
                gpa, totalCredits
            };
            document.getElementById('exportSelector').style.display = 'inline-block';
            
        }

        function calculateCGPA() {
            const rows = document.querySelectorAll('.subject-row, .custom-subject-row');
            let totalPassedCredits = 0, totalPassedGradePoints = 0;
            const subjectGrades = [];
            // FIX: renamed from 'semesterData' to 'semBreakdown' to avoid variable shadowing
            const semBreakdown  = {};
            let hasError = false, hasArrears = false;

            rows.forEach(row => {
                let credits, name, code = '';
                if (row.classList.contains('custom-subject-row')) {
                    const ni = row.querySelector('.custom-name');
                    const ci = row.querySelector('.custom-credits');
                    ni.classList.remove('invalid'); ci.classList.remove('invalid');
                    const nv = ni.value.trim();
                    const cv = parseFloat(ci.value);
                    if (!nv) { ni.classList.add('invalid'); hasError = true; }
                    if (!ci.value || isNaN(cv) || cv <= 0) { ci.classList.add('invalid'); hasError = true; }
                    if (!nv || isNaN(cv) || cv <= 0) return;
                    credits = cv; name = nv;
                    code = row.querySelector('.custom-code').value.trim() || '—';
                } else {
                    const txt = row.querySelector('.subject-code').textContent;
                    credits = parseFloat(row.querySelector('.credit-display').textContent);
                    const parts = txt.split(' - ');
                    code = parts[0].trim(); name = parts.slice(1).join(' - ').trim();
                }

                const gradeSelect = row.querySelector('.grade-select');
                const grade    = parseFloat(gradeSelect.value);
                const semester = gradeSelect.getAttribute('data-semester');
                const gp       = Math.max(0, grade);

                subjectGrades.push({ code, name, grade, credits, semester });

                // ── Per-semester breakdown (for Semester GPA: includes all subjects) ──
                if (!semBreakdown[semester]) {
                    semBreakdown[semester] = {
                        allCredits: 0, allGradePoints: 0,
                        passedCredits: 0, passedGradePoints: 0,
                        subjects: []
                    };
                }
                semBreakdown[semester].allCredits      += credits;
                semBreakdown[semester].allGradePoints  += credits * gp;
                semBreakdown[semester].subjects.push({ code, name, grade, credits });

                // FIX: CGPA denominator only includes successfully passed subjects (grade > 0)
                // Subjects with U (0), W (-1), SA (-2) are excluded per Anna University regulations
                if (grade > 0) {
                    totalPassedCredits     += credits;
                    totalPassedGradePoints += credits * gp;
                    semBreakdown[semester].passedCredits     += credits;
                    semBreakdown[semester].passedGradePoints += credits * gp;
                } else {
                    hasArrears = true;
                }
            });

            if (hasError) { alert('Please fill in Subject Name and Credits for all added subjects.'); return; }
            if (totalPassedCredits === 0 && subjectGrades.length === 0) {
                alert('No subjects found to calculate CGPA.'); return;
            }
            if (totalPassedCredits === 0) {
                alert('All subjects appear to be failed/withdrawn. CGPA cannot be computed.'); return;
            }

            const cgpa = totalPassedGradePoints / totalPassedCredits;
            document.getElementById('gpa-result').textContent   = cgpa.toFixed(2);
            document.getElementById('total-credits').textContent = totalPassedCredits;
            document.getElementById('results').style.display    = 'block';
            document.getElementById('arrear-warning').style.display = hasArrears ? 'block' : 'none';

            const fromVal = document.getElementById('semesterFrom').value;
            const toVal   = document.getElementById('semesterTo').value;
            lastCalcData  = {
                mode: 'cgpa',
                rangeLabel: `Semester ${fromVal} – ${toVal}`,
                semBreakdown,
                cgpa,
                totalPassedCredits,
                hasArrears
            };
            document.getElementById('exportSelector').style.display = 'inline-block';

            displaySemesterGPABreakdown(semBreakdown);
            
        }

        function displaySemesterGPABreakdown(semBreakdown) {
            const bd  = document.getElementById('semester-gpa-breakdown');
            const lst = document.getElementById('semester-gpa-list');
            bd.style.display = 'block';
            lst.innerHTML = '';
            Object.keys(semBreakdown).sort((a, b) => +a - +b).forEach(sem => {
                const d   = semBreakdown[sem];
                const gpa = d.allCredits > 0 ? (d.allGradePoints / d.allCredits).toFixed(2) : 'N/A';
                const div = document.createElement('div');
                div.style.cssText = 'padding:0.5rem;margin:0.5rem 0;background:#f0f0f0;border-radius:4px;display:flex;justify-content:space-between;';
                div.innerHTML = `<span><strong>Semester ${sem}:</strong></span><span>GPA: <strong>${gpa}</strong>&nbsp;&nbsp;Credits: ${d.allCredits}</span>`;
                lst.appendChild(div);
            });
        }



        // ── Image Export ──────────────────────────────────────────────────
        function exportImage() {
            if (!lastCalcData) return;
            const card = document.getElementById('result-card');
            card.innerHTML = buildResultCardHTML(lastCalcData);

            const btn = document.getElementById('exportImgBtn');
            btn.textContent = '⏳ Generating…';
            btn.disabled = true;

            setTimeout(() => {
                html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
                    const link = document.createElement('a');
                    const ts   = new Date().toISOString().slice(0,10);
                    link.download = lastCalcData.mode === 'gpa'
                        ? `GPA_${lastCalcData.semesterLabel.replace(/\s+/g,'_')}_${ts}.png`
                        : `CGPA_Sem${lastCalcData.rangeLabel.replace(/[^0-9]/g,'_')}_${ts}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    btn.textContent = '📷 Export as Image';
                    btn.disabled = false;
                    card.innerHTML = '';
                });
            }, 100);
        }
// ── Export Handling ───────────────────────────────────────────────
        function handleExport(selectElement) {
            const choice = selectElement.value;
            if (choice === 'image') exportImage();
            if (choice === 'pdf') exportPDF();
            
            // Reset the selector back to the default text
            selectElement.selectedIndex = 0; 
        }

        function exportImage() {
            if (!lastCalcData) return;
            const card = document.getElementById('result-card');
            card.innerHTML = buildResultCardHTML(lastCalcData);

            const sel = document.getElementById('exportSelector');
            sel.disabled = true;

            setTimeout(() => {
                html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
                    const link = document.createElement('a');
                    const ts   = new Date().toISOString().slice(0,10);
                    link.download = lastCalcData.mode === 'gpa'
                        ? `GPA_${lastCalcData.semesterLabel.replace(/\s+/g,'_')}_${ts}.png`
                        : `CGPA_Sem${lastCalcData.rangeLabel.replace(/[^0-9]/g,'_')}_${ts}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    sel.disabled = false;
                    card.innerHTML = '';
                });
            }, 100);
        }

function exportPDF() {
            if (!lastCalcData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Match exact colors from your CSS
            const brandBlue = [30, 58, 138];   // #1e3a8a
            const primaryBlue = [37, 99, 235]; // #2563eb
            const lightBlue = [239, 246, 255]; // #eff6ff
            const textDark = [30, 41, 59];     // #1e293b
            const textGrey = [71, 85, 105];    // #475569
            const greenPass = [21, 128, 61];   // #15803d
            const redFail = [185, 28, 28];     // #b91c1c

            const pageWidth = doc.internal.pageSize.getWidth();

            // Header matching the image
            doc.setFontSize(16);
            doc.setTextColor(...brandBlue);
            doc.setFont('helvetica', 'bold');
            doc.text('JCT CET R21 — B.E. Electrical and Electronics Engineering', pageWidth/2, 18, { align: 'center' });

            doc.setFontSize(11);
            doc.setTextColor(...textGrey);
            doc.setFont('helvetica', 'normal');
            doc.text('GPA / CGPA Academic Record', pageWidth/2, 25, { align: 'center' });

            // Divider Line
            doc.setDrawColor(...primaryBlue);
            doc.setLineWidth(0.8);
            doc.line(14, 30, pageWidth - 14, 30);

            let y = 38;

            if (lastCalcData.mode === 'gpa') {
                // Section Title
                doc.setFontSize(11);
                doc.setTextColor(...primaryBlue);
                doc.setFont('helvetica', 'bold');
                doc.text(`${lastCalcData.semesterLabel.toUpperCase()} — SEMESTER GPA REPORT`, 14, y);
                y += 6;

                // Table Data (Now includes all columns from the image)
                const tableRows = lastCalcData.subjects.map((s, index) => [
                    index + 1,
                    s.code || '—',
                    s.name,
                    s.credits,
                    gradeStr(s.grade),
                    Math.max(0, s.grade * s.credits).toFixed(1)
                ]);

                // Draw Table
                doc.autoTable({
                    startY: y,
                    head: [['S.No', 'Subject Code', 'Subject Name', 'Credits', 'Grade', 'Grade×Cr']],
                    body: tableRows,
                    theme: 'grid',
                    headStyles: { fillColor: brandBlue, textColor: 255, fontStyle: 'bold', fontSize: 9, halign: 'left' },
                    bodyStyles: { fontSize: 9, textColor: textDark },
                    alternateRowStyles: { fillColor: lightBlue },
                    columnStyles: { 
                        0: { cellWidth: 15, halign: 'center' },
                        1: { cellWidth: 30, halign: 'left' },
                        2: { cellWidth: 'auto', halign: 'left' },
                        3: { cellWidth: 20, halign: 'center' },
                        4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
                        5: { cellWidth: 25, halign: 'center' }
                    },
                    didParseCell: function(data) {
                        // Color grades Green (Pass) or Red (Fail) to match the image
                        if (data.section === 'body' && data.column.index === 4) {
                            const pass = lastCalcData.subjects[data.row.index].grade > 0;
                            data.cell.styles.textColor = pass ? greenPass : redFail;
                        }
                    },
                    margin: { left: 14, right: 14 }
                });

                y = doc.lastAutoTable.finalY + 8;

                // Large Summary Box (Matching the image)
                doc.setFillColor(...brandBlue);
                doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SEMESTER GPA', 20, y + 8);
                doc.setFontSize(22);
                doc.setFont('helvetica', 'bold');
                doc.text(`${lastCalcData.gpa.toFixed(2)}`, 20, y + 17);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Total Credits', pageWidth - 20, y + 8, { align: 'right' });
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.text(`${lastCalcData.totalCredits}`, pageWidth - 20, y + 17, { align: 'right' });

            } else {
                // CGPA Mode (Updated with similar styling)
                doc.setFontSize(11);
                doc.setTextColor(...primaryBlue);
                doc.setFont('helvetica', 'bold');
                doc.text(`CGPA REPORT — ${lastCalcData.rangeLabel.toUpperCase()}`, 14, y);
                y += 8;

                const semKeys = Object.keys(lastCalcData.semBreakdown).sort((a,b) => +a - +b);

                semKeys.forEach(sem => {
                    const sd = lastCalcData.semBreakdown[sem];
                    const semGpa = sd.allCredits > 0 ? (sd.allGradePoints / sd.allCredits).toFixed(2) : 'N/A';

                    if (y > 240) { doc.addPage(); y = 20; }

                    // Semester Header Strip
                    doc.setFillColor(219, 234, 254); // #dbeafe
                    doc.rect(14, y, pageWidth - 28, 7, 'F');
                    doc.setFontSize(9);
                    doc.setTextColor(...brandBlue);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Semester ${sem}`, 16, y + 5);
                    y += 7;

                    const tableRows = sd.subjects.map((s, index) => [
                        index + 1, s.code || '—', s.name, s.credits, gradeStr(s.grade)
                    ]);

                    doc.autoTable({
                        startY: y,
                        head: [['S.No', 'Subject Code', 'Subject Name', 'Credits', 'Grade']],
                        body: tableRows,
                        theme: 'grid',
                        headStyles: { fillColor: brandBlue, textColor: 255, fontStyle: 'bold', fontSize: 9 },
                        bodyStyles: { fontSize: 8.5, textColor: textDark },
                        alternateRowStyles: { fillColor: lightBlue },
                        columnStyles: { 
                            0: { cellWidth: 15, halign: 'center' },
                            1: { cellWidth: 30, halign: 'left' },
                            2: { cellWidth: 'auto', halign: 'left' },
                            3: { cellWidth: 20, halign: 'center' },
                            4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }
                        },
                        didParseCell: function(data) {
                            if (data.section === 'body' && data.column.index === 4) {
                                const pass = sd.subjects[data.row.index].grade > 0;
                                data.cell.styles.textColor = pass ? greenPass : redFail;
                            }
                        },
                        margin: { left: 14, right: 14 }
                    });

                    y = doc.lastAutoTable.finalY + 2;

                    // Semester Sub-total Strip
                    doc.setFillColor(...lightBlue);
                    doc.setDrawColor(147, 197, 253);
                    doc.setLineWidth(0.3);
                    doc.roundedRect(14, y, pageWidth - 28, 9, 1.5, 1.5, 'FD');
                    doc.setTextColor(...brandBlue);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Semester ${sem} GPA`, 18, y + 6);
                    doc.text(`${semGpa}`, 65, y + 6);
                    doc.setTextColor(...brandBlue);
                    doc.text(`Credits: ${sd.allCredits}`, pageWidth - 20, y + 6, { align: 'right' });
                    y += 14;
                });

                if (y > 255) { doc.addPage(); y = 20; }

                // Large CGPA Summary Box
                doc.setFillColor(...brandBlue);
                doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('CUMULATIVE CGPA', 20, y + 8);
                doc.setFontSize(22);
                doc.setFont('helvetica', 'bold');
                doc.text(`${lastCalcData.cgpa.toFixed(2)}`, 20, y + 17);
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Credits Counted', pageWidth - 20, y + 8, { align: 'right' });
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.text(`${lastCalcData.totalPassedCredits}`, pageWidth - 20, y + 17, { align: 'right' });
                
                if (lastCalcData.hasArrears) {
                    doc.setTextColor(...redFail);
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.text('⚠ Subjects graded U / W / SA are excluded from CGPA denominator (Anna University Regulations).', 14, y + 27);
                }
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(...textGrey);
                const ts = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
                doc.text(`Generated on ${ts} | Anna University EEE GPA Calculator`, pageWidth/2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }

            const tsStr = new Date().toISOString().slice(0,10);
            const filename = lastCalcData.mode === 'gpa'
                ? `GPA_${lastCalcData.semesterLabel.replace(/\s+/g, '_')}_${tsStr}.pdf`
                : `CGPA_${lastCalcData.rangeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tsStr}.pdf`;

            doc.save(filename);
        }
        function buildResultCardHTML(data) {
            const now = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

            const header = `
                <div class="rc-header">
                    <div class="rc-title">Anna University — B.E. Electrical and Electronics Engineering</div>
                    <div class="rc-subtitle">GPA / CGPA Academic Record</div>
                </div>
                <hr class="rc-divider">`;

            const footer = `<div class="rc-footer">Generated on ${now} &nbsp;|&nbsp; Anna University EEE GPA Calculator</div>`;

            if (data.mode === 'gpa') {
                const rows = data.subjects.map((s, i) => {
                    const gl   = gradeStr(s.grade);
                    const pass = s.grade > 0;
                    return `<tr>
                        <td class="center">${i+1}</td>
                        <td>${s.code || '—'}</td>
                        <td>${s.name}</td>
                        <td class="center">${s.credits}</td>
                        <td class="${pass ? 'grade-pass' : 'grade-fail'}">${gl}</td>
                        <td class="center">${Math.max(0, s.grade * s.credits).toFixed(1)}</td>
                    </tr>`;
                }).join('');

                return header + `
                    <div class="rc-mode-label">${data.semesterLabel} — Semester GPA Report</div>
                    <table>
                        <thead><tr>
                            <th class="center" style="width:40px">S.No</th>
                            <th style="width:110px">Subject Code</th>
                            <th>Subject Name</th>
                            <th class="center" style="width:60px">Credits</th>
                            <th class="center" style="width:55px">Grade</th>
                            <th class="center" style="width:65px">Grade×Cr</th>
                        </tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="rc-cgpa-box">
                        <div><div class="label">SEMESTER GPA</div><div class="value">${data.gpa.toFixed(2)}</div></div>
                        <div style="text-align:right"><div class="label">Total Credits</div><div class="credits" style="font-size:18px;opacity:1;font-weight:700;">${data.totalCredits}</div></div>
                    </div>
                    ${footer}`;
            } else {
                // CGPA mode
                const semKeys = Object.keys(data.semBreakdown).sort((a,b)=>+a-+b);
                let semSections = '';
                semKeys.forEach(sem => {
                    const sd  = data.semBreakdown[sem];
                    const sgpa = sd.allCredits > 0 ? (sd.allGradePoints / sd.allCredits).toFixed(2) : 'N/A';
                    const rows = sd.subjects.map((s, i) => {
                        const gl   = gradeStr(s.grade);
                        const pass = s.grade > 0;
                        return `<tr>
                            <td class="center">${i+1}</td>
                            <td>${s.code || '—'}</td>
                            <td>${s.name}</td>
                            <td class="center">${s.credits}</td>
                            <td class="${pass ? 'grade-pass' : 'grade-fail'}">${gl}</td>
                        </tr>`;
                    }).join('');

                    semSections += `
                        <tr class="rc-sem-header"><td colspan="5">Semester ${sem}</td></tr>
                        ${rows}`;
                });

                // Build single table with all semesters + sub-totals as strips
                let tableBody = '';
                let stripHTML = '';
                semKeys.forEach(sem => {
                    const sd  = data.semBreakdown[sem];
                    const sgpa = sd.allCredits > 0 ? (sd.allGradePoints / sd.allCredits).toFixed(2) : 'N/A';
                    const rows = sd.subjects.map((s, i) => {
                        const gl   = gradeStr(s.grade);
                        const pass = s.grade > 0;
                        return `<tr>
                            <td class="center">${i+1}</td>
                            <td>${s.code || '—'}</td>
                            <td>${s.name}</td>
                            <td class="center">${s.credits}</td>
                            <td class="${pass ? 'grade-pass' : 'grade-fail'}">${gl}</td>
                        </tr>`;
                    }).join('');
                    tableBody += `<tr class="rc-sem-header"><td colspan="5">Semester ${sem}</td></tr>${rows}`;
                    stripHTML += `<div class="rc-gpa-strip"><span>Semester ${sem} GPA</span><span>${sgpa} &nbsp;&nbsp; Credits: ${sd.allCredits}</span></div>`;
                });

                const arrearNote = data.hasArrears
                    ? `<p style="font-size:11px;color:#b91c1c;margin:6px 0 0;">⚠ Subjects graded U / W / SA are excluded from CGPA denominator (Anna University Regulations).</p>`
                    : '';

                return header + `
                    <div class="rc-mode-label">CGPA Report — ${data.rangeLabel}</div>
                    <table>
                        <thead><tr>
                            <th class="center" style="width:40px">S.No</th>
                            <th style="width:110px">Subject Code</th>
                            <th>Subject Name</th>
                            <th class="center" style="width:60px">Credits</th>
                            <th class="center" style="width:55px">Grade</th>
                        </tr></thead>
                        <tbody>${tableBody}</tbody>
                    </table>
                    ${stripHTML}
                    <div class="rc-cgpa-box">
                        <div><div class="label">CUMULATIVE CGPA</div><div class="value">${data.cgpa.toFixed(2)}</div></div>
                        <div style="text-align:right"><div class="label">Credits Counted</div><div class="credits" style="font-size:18px;opacity:1;font-weight:700;">${data.totalPassedCredits}</div></div>
                    </div>
                    ${arrearNote}
                    ${footer}`;
            }
        }

        // ── Init ──────────────────────────────────────────────────────────
        updateSemesterOptions();
