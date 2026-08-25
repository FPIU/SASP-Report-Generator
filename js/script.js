// SASP CAD Report Generator
// Traffic Citation & Arrest Report Formatter

const preview = document.getElementById("preview");
const previewMeta = document.getElementById("previewMeta");
const previewTag = document.getElementById("previewTag");

let currentReportType = "citation"; // "citation" or "arrest"

// Format a single 3-column row for STOP BASIS (PC/RS)
// Total width: col1(22) + col2(22) + col3(remainder) — fits in 59-char preview
function formatStopBasisRow(item1, checked1, item2, checked2, item3, checked3, otherText = "") {
    const c1 = checked1 ? "[x]" : "[ ]";
    const c2 = checked2 ? "[x]" : "[ ]";
    const c3 = checked3 ? "[x]" : "[ ]";

    const col1 = `${c1} ${item1}`.padEnd(22, " ");
    const col2 = `${c2} ${item2}`.padEnd(22, " ");
    const col3 = item3 === "Other:"
        ? `${c3} Other:${otherText ? " " + otherText : ""}`
        : `${c3} ${item3}`;

    return `${col1}${col2}${col3}`;
}

// Generate full CAD monospace text for TRAFFIC CITATION
function generateCadCitationText() {
    const isChecked = (id) => Boolean(document.getElementById(id)?.checked);
    const getVal = (id) => document.getElementById(id)?.value || "";

    // 1. Incident & Location
    const dateVal = getVal("date");
    const timeVal = getVal("time");
    const postalVal = getVal("postal");
    const streetVal = getVal("street");

    const dateLine = `Date: \t${dateVal}`;
    const timeLine = `Time: ${timeVal ? timeVal : " "}`;
    const locLine = `Location/Postal: ${postalVal}`;
    const streetLine = `Street/Road: ${streetVal}`;

    // 2. Driver Information
    const driverName = getVal("driver_name");
    const driverId = getVal("driver_id");

    // 3. Vehicle Information
    const vehMake = getVal("veh_make");
    const vehColor = getVal("veh_color") || (document.getElementById("veh_color") ? "" : "Black");
    const vehPlate = getVal("veh_plate");
    const vehState = getVal("veh_state") || (document.getElementById("veh_state") ? "" : "SA");

    // 4. Stop Basis (PC/RS) — labels kept ≤17 chars so 3 cols fit in 59-char preview
    const otherText = getVal("basis_other_text");

    const basisRow1 = formatStopBasisRow("Speed",              isChecked("basis_speed"),          "Stop Sign",        isChecked("basis_stopsign"),      "Fail to Yield",      isChecked("basis_yield"));
    const basisRow2 = formatStopBasisRow("Improper Signal",    isChecked("basis_signal"),          "Lane/Unsafe Chg",  isChecked("basis_lane"),          "Following Close",    isChecked("basis_following"));
    const basisRow3 = formatStopBasisRow("Right of Way",       isChecked("basis_rightofway"),      "Cell/Texting",     isChecked("basis_cellphone"),     "Seatbelt",           isChecked("basis_seatbelt"));
    const basisRow4 = formatStopBasisRow("Equipment (lights)", isChecked("basis_equipment"),       "Window Tint",      isChecked("basis_tint"),          "Loud Exhaust/Noise", isChecked("basis_exhaust"));
    const basisRow5 = formatStopBasisRow("Expired Reg/Plates", isChecked("basis_expiredreg"),      "No Insurance",     isChecked("basis_insurance"),     "Exhibition Speed",   isChecked("basis_exhibition"));
    const basisRow6 = formatStopBasisRow("School Zone",        isChecked("basis_schoolzone"),      "Work Zone",        isChecked("basis_workzone"),      "Yield (Emergency)",  isChecked("basis_emergency_yield"));
    const basisRow7 = formatStopBasisRow("DUI/Impairment",     isChecked("basis_dui"),             "Documentation",    isChecked("basis_documentation"), "Other:",             isChecked("basis_other") || Boolean(otherText), otherText);

    // 5. Speed (if applicable)
    const speedPosted = getVal("speed_posted");
    const speedAlleged = getVal("speed_alleged");
    const calibDate = getVal("calibration_date");

    const methodRadar = isChecked("speed_radar") ? "[x]" : "[ ]";
    const methodLidar = isChecked("speed_lidar") ? "[x]" : "[ ]";
    const methodPace = isChecked("speed_pace") ? "[x]" : "[ ]";
    const methodVisual = isChecked("speed_visual") ? "[x]" : "[ ]";

    const postedStr = speedPosted ? `${speedPosted} ` : "";
    const allegedStr = speedAlleged ? `${speedAlleged} ` : "";
    const speedLine = `Posted: ${postedStr} Alleged: ${allegedStr} Method: ${methodRadar} RADAR ${methodLidar} LIDAR ${methodPace} Pace ${methodVisual} Visual Est.`;
    const calibLine = `Calibration Date:${calibDate ? " " + calibDate : ""}`;

    // 6. Direction of Travel
    const dirNorth = isChecked("dir_north") ? "[x]" : "[ ]";
    const dirSouth = isChecked("dir_south") ? "[x]" : "[ ]";
    const dirEast = isChecked("dir_east") ? "[x]" : "[ ]";
    const dirWest = isChecked("dir_west") ? "[x]" : "[ ]";
    const dirLine = `North ${dirNorth}   South ${dirSouth}   East ${dirEast}    West ${dirWest}  `;

    // 7. Violations (Dynamic list of rows)
    const citationRows = document.querySelectorAll("#citationViolationsList .violation-entry-row");
    const violationLines = [];
    if (citationRows.length > 0) {
        citationRows.forEach(row => {
            const titleInput = row.querySelector(".violation-search-input");
            const typeSelect = row.querySelector("select");
            const titleVal = titleInput ? titleInput.value.trim() : "";
            const typeVal = typeSelect ? typeSelect.value : "";
            violationLines.push(`Title: ${titleVal}\t\tMisd/Inf:${typeVal ? " " + typeVal : ""}`);
        });
    } else {
        violationLines.push("Title: \t\tMisd/Inf:");
    }

    // 8. Enforcement
    const enfCitation = isChecked("enf_citation") ? "[x]" : "[ ]";
    const enfWritten = isChecked("enf_written") ? "[x]" : "[ ]";
    const enfVerbal = isChecked("enf_verbal") ? "[x]" : "[ ]";
    const enfFixit = isChecked("enf_fixit") ? "[x]" : "[ ]";
    const fixitDue = getVal("fixit_due");
    const fixitDueStr = fixitDue ? `Fix-It (Due: ${fixitDue})` : `Fix-It (Due:)`;
    const enfLine1 = `${enfCitation} Citation ${enfWritten} Written Warning ${enfVerbal} Verbal Warning ${enfFixit} ${fixitDueStr}`;

    const towYes = isChecked("tow_yes") ? "[x]" : "[ ]";
    const towNo = isChecked("tow_no") ? "[x]" : "[ ]";
    const releasedTo = getVal("released_to");
    const enfLine2 = `Tow/Impound: ${towYes} Yes ${towNo} No Released To:${releasedTo ? " " + releasedTo : ""}`;

    // 9. Reporting Officer
    const callsign = (getVal("officer_callsign") || getVal("arr_officer_callsign") || "").trim();
    const rank = (getVal("officer_rank") || getVal("arr_officer_rank") || "").trim();
    const name = (getVal("officer_name") || getVal("arr_officer_name") || "").trim();

    const rankAndName = [rank, name].filter(Boolean).join(" ");
    const badgeText = callsign ? `Badge: ${callsign}` : `Badge:`;
    const officerNameLine = `Name: ${rankAndName ? rankAndName + " " : ""}${badgeText}`;
    const officerSigLine = `Signature: ${rankAndName}`;

    // 10. Defendant
    const defSig = getVal("defendant_sig") || (document.getElementById("defendant_sig") ? "E-Signature" : "");
    const copyYes = isChecked("copy_issued_no") ? "[ ]" : "[x]";
    const copyNo = isChecked("copy_issued_no") ? "[x]" : "[ ]";

    // 11. Notes
    const notesVal = getVal("notes");

    return [
        "SAN ANDREAS STATE POLICE — TRAFFIC REPORT",
        "",
        dateLine,
        timeLine,
        locLine,
        streetLine,
        "",
        "DRIVER INFORMATION:",
        `Name: ${driverName}`,
        `Identifier: ${driverId}`,
        "",
        "VEHICLE INFORMATION:",
        `Make/Type: ${vehMake}`,
        `Color: ${vehColor}`,
        `Plate: ${vehPlate}`,
        `State: ${vehState}`,
        "",
        "STOP BASIS (PC/RS):",
        basisRow1,
        basisRow2,
        basisRow3,
        basisRow4,
        basisRow5,
        basisRow6,
        basisRow7,
        "",
        "SPEED (if applicable):",
        speedLine,
        calibLine,
        "",
        "Direction of Travel:",
        dirLine,
        "",
        "VIOLATION(S):",
        ...violationLines,
        "",
        "ENFORCEMENT:",
        enfLine1,
        enfLine2,
        "",
        "REPORTING OFFICER:",
        officerNameLine,
        officerSigLine,
        "",
        "",
        "DEFENDANT:",
        "I promise to appear/pay or contest as instructed.",
        `Signature (or Refused): ${defSig} `,
        `Copy Issued: ${copyYes} Yes ${copyNo} No`,
        "",
        "",
        `Notes: ${notesVal}`
    ].join("\n");
}

// Generate full CAD monospace text for ARREST REPORT
function generateCadArrestText() {
    const isChecked = (id) => Boolean(document.getElementById(id)?.checked);
    const getVal = (id) => document.getElementById(id)?.value || "";

    // 1. Incident & Location
    const dateVal = getVal("arr_date");
    const timeVal = getVal("arr_time");
    const postalVal = getVal("arr_postal");
    const streetVal = getVal("arr_street");

    const dateLine = `Date: ${dateVal}`;
    const timeLine = `Time: ${timeVal ? timeVal : " "}`;
    const locLine = `Location/Postal: ${postalVal}`;
    const streetLine = `Road/Street: ${streetVal}`;

    // 2. Subject Information
    const subjectName = getVal("arr_subject_name");
    const subjectId = getVal("arr_subject_id");
    const subjectSex = getVal("arr_subject_sex");
    const subjectRace = getVal("arr_subject_race");

    // 3. Associated Vehicle
    const vehMake = getVal("arr_veh_make");
    const vehColor = getVal("arr_veh_color");
    const vehPlate = getVal("arr_veh_plate");
    const vehOwner = getVal("arr_veh_owner");

    // 4. Arrest Basis
    const basisOnView = isChecked("arr_basis_onview") ? "[x]" : "[ ]";
    const basisWarrant = isChecked("arr_basis_warrant") ? "[x]" : "[ ]";
    const warrantType = getVal("arr_warrant_type");
    const warrantCourt = getVal("arr_warrant_court");
    const warrantStr = `Warrant (Type/No.:${warrantType ? " " + warrantType : ""} Court:${warrantCourt ? " " + warrantCourt : ""} )`;

    const basisPC = isChecked("arr_basis_pc") ? "[x]" : "[ ]";
    const basisPursuit = isChecked("arr_basis_pursuit") ? "[x]" : "[ ]";
    const basisParole = isChecked("arr_basis_parole") ? "[x]" : "[ ]";
    const primaryPC = getVal("arr_primary_pc");

    const basisLine1 = `${basisOnView} On-View Offense ${basisWarrant} ${warrantStr}`;
    const basisLine2 = `${basisPC} Probable Cause  ${basisPursuit} Fresh Pursuit ${basisParole} Parole/Probation Clause`;
    const basisLine3 = `Primary PC (reason): ${primaryPC}`;

    // 5. Offenses / Charges (Dynamic list of rows)
    const chargeRows = document.querySelectorAll("#arrestChargesList .violation-entry-row");
    const chargeLines = [];
    if (chargeRows.length > 0) {
        chargeRows.forEach(row => {
            const titleInput = row.querySelector(".violation-search-input");
            const felInput = row.querySelector("input[id*='_fel'], input[data-type='fel']");
            const misdInput = row.querySelector("input[id*='_misd'], input[data-type='misd']");
            const infInput = row.querySelector("input[id*='_inf'], input[data-type='inf']");

            const titleVal = titleInput ? titleInput.value.trim() : "";
            const fel = felInput && felInput.checked ? "[x]" : "[ ]";
            const misd = misdInput && misdInput.checked ? "[x]" : "[ ]";
            const inf = infInput && infInput.checked ? "[x]" : "[ ]";

            chargeLines.push(`Title: ${titleVal}\t\tCharge(s) Level: ${fel} Fel ${misd} Misd ${inf} Inf`);
        });
    } else {
        chargeLines.push("Title: \t\tCharge(s) Level: [ ] Fel [ ] Misd [ ] Inf");
    }

    // 6. Miranda / Interviews
    const custYes = isChecked("arr_custodial_no") ? "[ ]" : "[x]";
    const custNo = isChecked("arr_custodial_no") ? "[x]" : "[ ]";

    const mirandaYes = isChecked("arr_miranda_no") ? "[ ]" : "[x]";
    const mirandaNo = isChecked("arr_miranda_no") ? "[x]" : "[ ]";
    const mirandaExplain = getVal("arr_miranda_explain");
    const mirandaStr = mirandaExplain ? `(explain: ${mirandaExplain})` : `(explain):`;

    const stmtNone = isChecked("arr_stmt_none") ? "[x]" : "[ ]";
    const stmtVerbal = isChecked("arr_stmt_verbal") ? "[x]" : "[ ]";
    const stmtWritten = isChecked("arr_stmt_written") ? "[x]" : "[ ]";
    const stmtRecorded = isChecked("arr_stmt_recorded") ? "[x]" : "[ ]";

    const interpNo = isChecked("arr_interp_yes") ? "[ ]" : "[x]";
    const interpYes = isChecked("arr_interp_yes") ? "[x]" : "[ ]";
    const interpLang = getVal("arr_interp_lang");
    const interpStr = `(Language:${interpLang ? " " + interpLang : ""} )`;

    // 7. Search / Seizure
    const sConsent = isChecked("arr_search_consent") ? "[x]" : "[ ]";
    const sPC = isChecked("arr_search_pc") ? "[x]" : "[ ]";
    const sIncident = isChecked("arr_search_incident") ? "[x]" : "[ ]";
    const sPatdown = isChecked("arr_search_patdown") ? "[x]" : "[ ]";
    const sInventory = isChecked("arr_search_inventory") ? "[x]" : "[ ]";
    const sWarrant = isChecked("arr_search_warrant") ? "[x]" : "[ ]";
    const sParole = isChecked("arr_search_parole") ? "[x]" : "[ ]";
    const searchLine = `Search Type: ${sConsent} Consent   ${sPC} Probable Cause   ${sIncident} Incident to Arrest   ${sPatdown} Pat-Down   ${sInventory} Inventory     ${sWarrant} Warrant           ${sParole} Parole Violation Check   `;
    const propSeized = getVal("arr_property_seized") || "N/A";

    // 8. Evidence
    const evBodycam = isChecked("arr_ev_bodycam") ? "[x]" : "[ ]";
    const bodycamId = getVal("arr_bodycam_id") || "AXOMMPA3KW9H";
    const evDashcam = isChecked("arr_ev_dashcam") ? "[x]" : "[ ]";
    const dashcamId = getVal("arr_dashcam_id") || "345376bnk2-00";

    const evPhotos = isChecked("arr_ev_photos") ? "[x]" : "[ ]";
    const evVideo = isChecked("arr_ev_video") ? "[x]" : "[ ]";
    const evAudio = isChecked("arr_ev_audio") ? "[x]" : "[ ]";
    const evField = isChecked("arr_ev_fieldtest") ? "[x]" : "[ ]";
    const fieldResult = getVal("arr_fieldtest_text");
    const evOther = isChecked("arr_ev_other") ? "[x]" : "[ ]";
    const otherEvText = getVal("arr_other_ev_text");

    const evLine1 = `${evBodycam} Bodycam (ID:${bodycamId} ) ${evDashcam} Dashcam (ID:${dashcamId} ) ${evPhotos} Photos ${evVideo} Video ${evAudio} Audio`;
    const evLine2 = `${evField} Field Tests (type/result):${fieldResult ? " " + fieldResult : ""}`;
    const evLine3 = `${evOther} Other:${otherEvText ? " " + otherEvText : ""}`;

    // 9. Use of Force / Injuries
    const fNone = isChecked("arr_force_holds") || isChecked("arr_force_takedown") || isChecked("arr_force_cew") || isChecked("arr_force_oc") || isChecked("arr_force_baton") || isChecked("arr_force_lethal") ? (isChecked("arr_force_none") ? "[x]" : "[ ]") : (isChecked("arr_force_none") ? "[x]" : "[ ]");
    const fHolds = isChecked("arr_force_holds") ? "[x]" : "[ ]";
    const fTakedown = isChecked("arr_force_takedown") ? "[x]" : "[ ]";
    const fCEW = isChecked("arr_force_cew") ? "[x]" : "[ ]";
    const fOC = isChecked("arr_force_oc") ? "[x]" : "[ ]";
    const fBaton = isChecked("arr_force_baton") ? "[x]" : "[ ]";
    const fLethal = isChecked("arr_force_lethal") ? "[x]" : "[ ]";
    const forceLine = `Force Used: ${fNone} None ${fHolds} Control Holds ${fTakedown} Takedown ${fCEW} CEW ${fOC} OC ${fBaton} Baton ${fLethal} Lethal Cover`;

    const iNone = isChecked("arr_inj_subject") || isChecked("arr_inj_officer") || isChecked("arr_inj_third") ? (isChecked("arr_inj_none") ? "[x]" : "[ ]") : (isChecked("arr_inj_none") ? "[x]" : "[ ]");
    const iSubj = isChecked("arr_inj_subject") ? "[x]" : "[ ]";
    const iOff = isChecked("arr_inj_officer") ? "[x]" : "[ ]";
    const iThird = isChecked("arr_inj_third") ? "[x]" : "[ ]";
    const injLine = `Injuries: ${iNone} None ${iSubj} Subject ${iOff} Officer ${iThird} Third Party `;

    const medDeclined = isChecked("arr_med_declined") ? "[x]" : "[ ]";
    const medProvided = isChecked("arr_med_provided") ? "[x]" : "[ ]";
    const medBy = getVal("arr_med_by");
    const medLine = `Medical Aid: ${medDeclined} Declined ${medProvided} Provided (by:${medBy ? " " + medBy : ""} )`;
    const medFacility = getVal("arr_med_facility");

    // 10. Booking / Disposition
    const callsign = (getVal("arr_officer_callsign") || getVal("officer_callsign") || "").trim();
    const rank = (getVal("arr_officer_rank") || getVal("officer_rank") || "").trim();
    const name = (getVal("arr_officer_name") || getVal("officer_name") || "").trim();
    const rankAndName = [rank, name].filter(Boolean).join(" ");

    const transportUnit = getVal("arr_transport_unit") || (rankAndName ? `${rankAndName}${callsign ? " | " + callsign : ""}` : "Deputy Chief D. Littin | S-05");
    const facility = getVal("arr_facility") || "Grapeseed State Police Station ";

    const bYes = isChecked("arr_booked_cite") || isChecked("arr_booked_detox") || isChecked("arr_booked_guardian") ? (isChecked("arr_booked_yes") ? "[x]" : "[ ]") : "[x]";
    const bCite = isChecked("arr_booked_cite") ? "[x]" : "[ ]";
    const bDetox = isChecked("arr_booked_detox") ? "[x]" : "[ ]";
    const bGuardian = isChecked("arr_booked_guardian") ? "[x]" : "[ ]";
    const bookedLine = `Booked: ${bYes} Yes ${bCite} Cite & Release ${bDetox} Detox/Med Clear then Book ${bGuardian} Released to Guardian`;

    const propLoggedYes = isChecked("arr_property_logged_yes") ? "[x]" : "[ ]";
    const propLoggedNo  = isChecked("arr_property_logged_no")  ? "[x]" : "[ ]";
    const photosYes = isChecked("arr_photos_yes") ? "[x]" : "[ ]";
    const photosNo = isChecked("arr_photos_no") ? "[x]" : "[ ]";

    const refDA = isChecked("arr_ref_city") || isChecked("arr_ref_probation") || isChecked("arr_ref_other") ? (isChecked("arr_ref_da") ? "[x]" : "[ ]") : "[x]";
    const refCity = isChecked("arr_ref_city") ? "[x]" : "[ ]";
    const refProb = isChecked("arr_ref_probation") ? "[x]" : "[ ]";
    const refOther = isChecked("arr_ref_other") ? "[x]" : "[ ]";
    const refOtherText = getVal("arr_ref_other_text");
    const caseRefLine = `Case Referred To: ${refDA} DA ${refCity} City Atty ${refProb} Probation ${refOther} Other${refOtherText ? ": " + refOtherText : ""}`;

    // 11. Officer Information & Narrative
    const assisting = getVal("arr_assisting");
    const supervisor = getVal("arr_supervisor");
    const supervisorTime = getVal("arr_supervisor_time") || "N/A";
    const completedAt = getVal("arr_completed_at");
    const narrative = getVal("arr_narrative");

    const officerRepLine = `Reporting Officer: ${rankAndName ? rankAndName + " " : ""}Badge:${callsign || ""}`;
    const supervisorLine = `Supervisor Notified: ${supervisor} Time: ${supervisorTime}`;
    const sigLine = `Signature: ${rankAndName || ""}`;

    return [
        "SAN ANDREAS STATE POLICE — ARREST REPORT",
        "",
        dateLine,
        timeLine,
        locLine,
        streetLine,
        "",
        "SUBJECT INFORMATION:",
        `Name:${subjectName ? " " + subjectName : ""}`,
        `Identifier: ${subjectId}`,
        `Sex: ${subjectSex} `,
        `Race: ${subjectRace}`,
        "",
        "ASSOCIATED VEHICLE (if applicable):",
        `Make/Type:${vehMake ? " " + vehMake : ""}`,
        `Color:${vehColor ? " " + vehColor : ""}`,
        `Plate: ${vehPlate}`,
        `Registered Owner (if different): ${vehOwner}`,
        "",
        "ARREST BASIS (PC/RS):",
        basisLine1,
        basisLine2,
        basisLine3,
        "",
        "OFFENSES / CHARGES:",
        ...chargeLines,
        "",
        "MIRANDA / INTERVIEWS:",
        `Custodial? ${custYes} Yes ${custNo} No `,
        `Miranda Given: ${mirandaYes} Yes ${mirandaNo} No ${mirandaStr}`,
        `Statement: ${stmtNone} None ${stmtVerbal} Verbal ${stmtWritten} Written ${stmtRecorded} Recorded`,
        `Interpreter Needed: ${interpNo} No ${interpYes} Yes ${interpStr}`,
        "",
        "SEARCH / SEIZURE:",
        "",
        searchLine,
        `Property Seized (brief): ${propSeized}`,
        "",
        "",
        "EVIDENCE:",
        evLine1,
        evLine2,
        evLine3,
        "",
        "USE OF FORCE / INJURIES:",
        forceLine,
        injLine,
        "",
        medLine,
        `Medical Facility:${medFacility ? " " + medFacility : ""}`,
        "",
        "BOOKING / DISPOSITION:",
        `Transported By (Unit): ${transportUnit}`,
        `Facility: ${facility}`,
        bookedLine,
        `Property Logged: ${propLoggedYes} Yes ${propLoggedNo} No`,
        `Photos: ${photosYes} Yes ${photosNo} No`,
        caseRefLine,
        "",
        "OFFICER INFORMATION:",
        officerRepLine,
        `Assisting Officer(s): ${assisting}`,
        supervisorLine,
        sigLine,
        `Report Completed @:${completedAt ? " " + completedAt : ""}`,
        `NARRATIVE: ${narrative}`
    ].join("\n");
}

// Update the Monospace CAD Preview
function updatePreview() {
    if (!preview) return;
    const text = currentReportType === "arrest" ? generateCadArrestText() : generateCadCitationText();
    preview.textContent = text;

    if (previewMeta) {
        const lineCount = text.split("\n").length;
        const charCount = text.length;
        previewMeta.textContent = `59 Col Monospace • ${lineCount} Lines • ${charCount} Chars`;
    }
}

// Switch between Citation and Arrest Report
function switchReportType(type) {
    currentReportType = type;

    const tabCitation = document.getElementById("tabCitation");
    const tabArrest = document.getElementById("tabArrest");
    const citationForm = document.getElementById("citationForm");
    const arrestForm = document.getElementById("arrestForm");
    const titleEl = document.getElementById("activeReportTitle");
    const descEl = document.getElementById("activeReportDesc");

    if (type === "arrest") {
        if (tabCitation) tabCitation.classList.remove("active");
        if (tabArrest) tabArrest.classList.add("active");
        if (citationForm) citationForm.style.display = "none";
        if (arrestForm) arrestForm.style.display = "flex";
        if (titleEl) titleEl.textContent = "Arrest Report Generator";
        if (descEl) descEl.textContent = "SAN ANDREAS STATE POLICE — ARREST REPORT";
        if (previewTag) previewTag.textContent = "ARREST REPORT";
    } else {
        if (tabCitation) tabCitation.classList.add("active");
        if (tabArrest) tabArrest.classList.remove("active");
        if (citationForm) citationForm.style.display = "flex";
        if (arrestForm) arrestForm.style.display = "none";
        if (titleEl) titleEl.textContent = "Traffic Report Generator";
        if (descEl) descEl.textContent = "SAN ANDREAS STATE POLICE — TRAFFIC REPORT";
        if (previewTag) previewTag.textContent = "TRAFFIC REPORT";
    }

    syncOfficerInputs();
    updatePreview();
}

// Keep officer inputs in sync between Citation and Arrest forms
function syncOfficerInputs() {
    const cs1 = document.getElementById("officer_callsign");
    const rk1 = document.getElementById("officer_rank");
    const nm1 = document.getElementById("officer_name");

    const cs2 = document.getElementById("arr_officer_callsign");
    const rk2 = document.getElementById("arr_officer_rank");
    const nm2 = document.getElementById("arr_officer_name");

    if (currentReportType === "arrest") {
        if (cs1?.value && !cs2?.value) cs2.value = cs1.value;
        if (rk1?.value && !rk2?.value) rk2.value = rk1.value;
        if (nm1?.value && !nm2?.value) nm2.value = nm1.value;
    } else {
        if (cs2?.value && !cs1?.value) cs1.value = cs2.value;
        if (rk2?.value && !rk1?.value) rk1.value = rk2.value;
        if (nm2?.value && !nm1?.value) nm1.value = nm2.value;
    }
}

// Copy to Clipboard
function copyCitation() {
    const text = preview?.textContent || "";
    if (!text.trim()) {
        showToast("Nothing to copy", "info");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast(`${currentReportType === "arrest" ? "Arrest Report" : "Citation"} copied to clipboard!`, "success");
        const copyBtn = document.getElementById("copyBtn");
        if (copyBtn) {
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Copied to Clipboard!
            `;
            setTimeout(() => {
                copyBtn.innerHTML = orig;
            }, 1800);
        }
    }).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("Copied to clipboard!", "success");
    });
}

// Download .txt report
function downloadReport() {
    const text = preview?.textContent || "";
    const date = new Date().toISOString().slice(0, 10);
    const tag = currentReportType === "arrest" ? "ARREST_REPORT" : "CITATION";
    const filename = `SASP_${tag}_${date}.txt`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`Saved ${filename}`, "success");
}

// Autofill Date and Time using the browser's local timezone
function setCurrentDateTime() {
    const now = new Date();

    // Use local time — respects the user's OS/browser timezone automatically
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Detect the short timezone abbreviation (e.g. BST, EST, PST, CEST)
    let tzAbbr = "";
    try {
        tzAbbr = new Intl.DateTimeFormat("en", { timeZoneName: "short" })
            .formatToParts(now)
            .find(p => p.type === "timeZoneName")?.value || "";
    } catch (e) { /* Intl not supported — leave blank */ }

    const localTime = `${hours}:${minutes} Hrs${tzAbbr ? " " + tzAbbr : ""}`;

    if (currentReportType === "arrest") {
        const arrDateField = document.getElementById("arr_date");
        const arrTimeField = document.getElementById("arr_time");
        if (arrDateField) arrDateField.value = `${month}/${day}/${year}`;
        if (arrTimeField) arrTimeField.value = localTime;
        showToast(`Date & time filled (${tzAbbr || "local"})`, "success");
    } else {
        const dateField = document.getElementById("date");
        const timeField = document.getElementById("time");
        if (dateField) dateField.value = `${month}/${day}/${year}`;
        if (timeField) timeField.value = localTime;
        showToast(`Date & time filled (${tzAbbr || "local"})`, "success");
    }

    updatePreview();
}

// Renumber violation or charge rows dynamically
function renumberViolationRows(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rows = container.querySelectorAll(".violation-entry-row");
    rows.forEach((row, idx) => {
        const numBadge = row.querySelector(".violation-row-num");
        if (numBadge) numBadge.textContent = `#${idx + 1}`;
        row.dataset.index = String(idx + 1);
    });
}

// Add a new dynamic Citation Violation Row
function addCitationViolationRow() {
    const container = document.getElementById("citationViolationsList");
    if (!container) return;
    const index = container.querySelectorAll(".violation-entry-row").length + 1;

    const row = document.createElement("div");
    row.className = "violation-entry-row";
    row.dataset.index = String(index);

    row.innerHTML = `
        <div class="violation-row-num">#${index}</div>
        <div class="violation-search-box">
            <input type="text" id="v${index}_title" class="form-input violation-search-input"
                placeholder="Violation ${index} (optional)..." autocomplete="off">
            <div id="v${index}_results" class="violation-results"></div>
        </div>
        <div class="violation-type-box">
            <select id="v${index}_type" class="form-select">
                <option value="">-- MISD / INF / FEL --</option>
                <option value="Inf">Infraction (Inf)</option>
                <option value="Misd">Misdemeanor (Misd)</option>
                <option value="Felony">Felony</option>
            </select>
        </div>
        <button type="button" class="btn btn-outline btn-sm clear-violation-btn"
            data-target="${index}" title="Clear or remove violation">✕</button>
    `;

    container.appendChild(row);

    const input = row.querySelector(".violation-search-input");
    const results = row.querySelector(".violation-results");
    const typeSelect = row.querySelector("select");
    const clearBtn = row.querySelector(".clear-violation-btn");

    setupViolationAutocomplete(input, results, typeSelect);

    clearBtn.addEventListener("click", () => {
        if (container.querySelectorAll(".violation-entry-row").length > 3) {
            row.remove();
            renumberViolationRows("citationViolationsList");
        } else {
            input.value = "";
            typeSelect.selectedIndex = 0;
            applyViolationClassification(row, null);
        }
        updatePreview();
    });

    input.focus();
    updatePreview();
}

// Add a new dynamic Arrest Charge Row
function addArrestChargeRow() {
    const container = document.getElementById("arrestChargesList");
    if (!container) return;
    const index = container.querySelectorAll(".violation-entry-row").length + 1;

    const row = document.createElement("div");
    row.className = "violation-entry-row";
    row.dataset.index = String(index);

    row.innerHTML = `
        <div class="violation-row-num">#${index}</div>
        <div class="violation-search-box">
            <input type="text" id="arr_c${index}_title" class="form-input violation-search-input"
                placeholder="Charge ${index} (optional)..." autocomplete="off">
            <div id="arr_c${index}_results" class="violation-results"></div>
        </div>
        <div class="pill-group" style="flex-shrink:0;">
            <label class="pill-btn"><input type="checkbox" id="arr_c${index}_fel" data-type="fel"><span>Fel</span></label>
            <label class="pill-btn"><input type="checkbox" id="arr_c${index}_misd" data-type="misd"><span>Misd</span></label>
            <label class="pill-btn"><input type="checkbox" id="arr_c${index}_inf" data-type="inf"><span>Inf</span></label>
        </div>
        <button type="button" class="btn btn-outline btn-sm clear-arr-charge-btn"
            data-target="${index}" title="Clear or remove charge">✕</button>
    `;

    container.appendChild(row);

    const input = row.querySelector(".violation-search-input");
    const results = row.querySelector(".violation-results");
    const clearBtn = row.querySelector(".clear-arr-charge-btn");

    setupViolationAutocomplete(input, results, null, index);

    clearBtn.addEventListener("click", () => {
        if (container.querySelectorAll(".violation-entry-row").length > 3) {
            row.remove();
            renumberViolationRows("arrestChargesList");
        } else {
            input.value = "";
            applyViolationClassification(row, null);
        }
        updatePreview();
    });

    input.focus();
    updatePreview();
}

// Clear Form Fields (retains officer credentials)
function clearForm() {
    const activeFormId = currentReportType === "arrest" ? "arrestForm" : "citationForm";
    const form = document.getElementById(activeFormId);
    if (!form) return;

    form.querySelectorAll("input, textarea, select").forEach(el => {
        if (el.id === "officer_callsign" || el.id === "officer_rank" || el.id === "officer_name" ||
            el.id === "arr_officer_callsign" || el.id === "arr_officer_rank" || el.id === "arr_officer_name") {
            return;
        }

        if (el.type === "checkbox") {
            el.checked = false;
            el.disabled = false;
        } else if (el.tagName === "SELECT") {
            el.selectedIndex = 0;
            el.disabled = false;
        } else {
            el.value = "";
        }
    });

    // Unlock any locked pill button labels
    form.querySelectorAll(".pill-btn").forEach(l => l.classList.remove("pill-locked"));

    // Reset extra rows back to default 3
    if (currentReportType === "arrest") {
        const container = document.getElementById("arrestChargesList");
        if (container) {
            const rows = container.querySelectorAll(".violation-entry-row");
            rows.forEach((r, idx) => {
                if (idx >= 3) r.remove();
            });
            renumberViolationRows("arrestChargesList");
        }
    } else {
        const container = document.getElementById("citationViolationsList");
        if (container) {
            const rows = container.querySelectorAll(".violation-entry-row");
            rows.forEach((r, idx) => {
                if (idx >= 3) r.remove();
            });
            renumberViolationRows("citationViolationsList");
        }
    }

    updatePreview();
    showToast("Form cleared", "info");
}

// Pre-fill realistic example for testing
function loadExampleData() {
    setCurrentDateTime();
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const setCheck = (id, checked) => { const el = document.getElementById(id); if (el) el.checked = checked; };

    if (currentReportType === "arrest") {
        setVal("arr_postal", "Postal 2044 / Grapeseed");
        setVal("arr_street", "Main St / Seaview Rd");
        setVal("arr_officer_callsign", "S-05");
        setVal("arr_officer_rank", "Deputy Chief");
        setVal("arr_officer_name", "D. Littin");

        setVal("arr_subject_name", "Trevor Philips");
        setVal("arr_subject_id", "DL-992014");
        setVal("arr_subject_sex", "M");
        setVal("arr_subject_race", "Caucasian");

        setVal("arr_veh_make", "Canis Bodhi");
        setVal("arr_veh_color", "Red");
        setVal("arr_veh_plate", "BETTY33");
        setVal("arr_veh_owner", "Trevor Philips");

        setCheck("arr_basis_onview", true);
        setCheck("arr_basis_pc", true);
        setVal("arr_primary_pc", "Suspect fled from marked SASP vehicle and was found in possession of illegal firearms.");

        const c1Row = document.querySelector("#arrestChargesList .violation-entry-row:nth-child(1)");
        setVal("arr_c1_title", "FLEEING OR ATTEMPTING TO ELUDE A PEACE OFFICER");
        if (c1Row) {
            const match1 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("FLEEING"));
            applyViolationClassification(c1Row, match1);
        }

        const c2Row = document.querySelector("#arrestChargesList .violation-entry-row:nth-child(2)");
        setVal("arr_c2_title", "POSSESSION OF ILLEGAL FIREARMS");
        if (c2Row) {
            const match2 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("ILLEGAL FIREARMS"));
            applyViolationClassification(c2Row, match2);
        }

        const c3Row = document.querySelector("#arrestChargesList .violation-entry-row:nth-child(3)");
        setVal("arr_c3_title", "RESISTING ARREST");
        if (c3Row) {
            const match3 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("RESISTING"));
            applyViolationClassification(c3Row, match3);
        }

        setCheck("arr_custodial_yes", true);
        setCheck("arr_miranda_yes", true);
        setCheck("arr_stmt_verbal", true);
        setCheck("arr_interp_no", true);

        setCheck("arr_search_incident", true);
        setVal("arr_property_seized", "1x Vintage Pistol, 24 rounds 9mm, $420 cash");

        setCheck("arr_ev_bodycam", true);
        setVal("arr_bodycam_id", "AXOMMPA3KW9H");
        setCheck("arr_ev_dashcam", true);
        setVal("arr_dashcam_id", "345376bnk2-00");

        setCheck("arr_force_holds", true);
        setCheck("arr_force_takedown", true);
        setCheck("arr_inj_none", true);
        setCheck("arr_med_declined", true);

        setVal("arr_transport_unit", "Deputy Chief D. Littin | S-05");
        setVal("arr_facility", "Grapeseed State Police Station");
        setCheck("arr_booked_yes", true);
        setCheck("arr_property_logged_yes", true);
        setCheck("arr_photos_yes", true);
        setCheck("arr_ref_da", true);

        setVal("arr_supervisor", "Sgt. Miller");
        setVal("arr_supervisor_time", "14:40");
        setVal("arr_completed_at", "15:30");
        setVal("arr_narrative", "On 08/25/2026 at approximately 14:15, SASP units initiated a traffic stop on subject vehicle for excessive speed. Vehicle failed to yield and engaged units in a high-speed vehicle pursuit (fleeing & eluding). PIT maneuver executed on Seaview Rd. Subject resisted commands and was subdued using control holds. Search incident to arrest revealed illegal firearms.");
        showToast("Loaded sample arrest report", "success");
    } else {
        setVal("postal", "Postal 1024 / Sandy Shores");
        setVal("street", "Joshua Road / Route 68");
        setVal("officer_callsign", "S-05");
        setVal("officer_rank", "Deputy Chief");
        setVal("officer_name", "D. Littin");

        setVal("driver_name", "Berry Doofus");
        setVal("driver_id", "DL-8829104");
        setVal("veh_make", "Dodge Charger");
        setVal("veh_color", "Black");
        setVal("veh_plate", "88SASP01");
        setVal("veh_state", "SA");

        setCheck("basis_speed", true);
        setCheck("basis_lane", true);
        setCheck("basis_tint", true);

        setVal("speed_posted", "65");
        setVal("speed_alleged", "88");
        setCheck("speed_radar", true);
        setVal("calibration_date", "08/01/2026");

        setCheck("dir_north", true);

        const v1Row = document.querySelector("#citationViolationsList .violation-entry-row:nth-child(1)");
        setVal("v1_title", "SPEEDING (21 MPH +)");
        if (v1Row) {
            const match1 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("SPEEDING (21"));
            applyViolationClassification(v1Row, match1);
        }

        const v2Row = document.querySelector("#citationViolationsList .violation-entry-row:nth-child(2)");
        setVal("v2_title", "FAILURE TO MAINTAIN LANES");
        if (v2Row) {
            const match2 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("MAINTAIN LANES"));
            applyViolationClassification(v2Row, match2);
        }

        setCheck("enf_citation", true);
        setCheck("tow_no", true);
        setVal("notes", "Subject was cooperative during traffic stop. Cited and released without incident.");
        showToast("Loaded sample traffic report", "success");
    }

    updatePreview();
}

// Setup Mutual Exclusion on Selectable Groups
function initPillBehaviors() {
    // Speed method - single select
    const speedPills = ["speed_radar", "speed_lidar", "speed_pace", "speed_visual"].map(id => document.getElementById(id)).filter(Boolean);
    speedPills.forEach(pill => {
        pill.addEventListener("change", () => {
            if (pill.checked) speedPills.forEach(other => { if (other !== pill) other.checked = false; });
            updatePreview();
        });
    });

    // Direction - single select
    const dirPills = ["dir_north", "dir_south", "dir_east", "dir_west"].map(id => document.getElementById(id)).filter(Boolean);
    dirPills.forEach(pill => {
        pill.addEventListener("change", () => {
            if (pill.checked) dirPills.forEach(other => { if (other !== pill) other.checked = false; });
            updatePreview();
        });
    });

    // Tow/Impound
    const towYes = document.getElementById("tow_yes");
    const towNo = document.getElementById("tow_no");
    if (towYes && towNo) {
        towYes.addEventListener("change", () => { if (towYes.checked) towNo.checked = false; updatePreview(); });
        towNo.addEventListener("change", () => { if (towNo.checked) towYes.checked = false; updatePreview(); });
    }

    // Copy Issued
    const copyYes = document.getElementById("copy_issued_yes");
    const copyNo = document.getElementById("copy_issued_no");
    if (copyYes && copyNo) {
        copyYes.addEventListener("change", () => { if (copyYes.checked) copyNo.checked = false; updatePreview(); });
        copyNo.addEventListener("change", () => { if (copyNo.checked) copyYes.checked = false; updatePreview(); });
    }

    // Arrest Miranda
    const mirYes = document.getElementById("arr_miranda_yes");
    const mirNo = document.getElementById("arr_miranda_no");
    if (mirYes && mirNo) {
        mirYes.addEventListener("change", () => { if (mirYes.checked) mirNo.checked = false; updatePreview(); });
        mirNo.addEventListener("change", () => { if (mirNo.checked) mirYes.checked = false; updatePreview(); });
    }

    // Arrest Custodial
    const custYes = document.getElementById("arr_custodial_yes");
    const custNo = document.getElementById("arr_custodial_no");
    if (custYes && custNo) {
        custYes.addEventListener("change", () => { if (custYes.checked) custNo.checked = false; updatePreview(); });
        custNo.addEventListener("change", () => { if (custNo.checked) custYes.checked = false; updatePreview(); });
    }

    // Arrest Interpreter
    const intNo = document.getElementById("arr_interp_no");
    const intYes = document.getElementById("arr_interp_yes");
    if (intNo && intYes) {
        intNo.addEventListener("change", () => { if (intNo.checked) intYes.checked = false; updatePreview(); });
        intYes.addEventListener("change", () => { if (intYes.checked) intNo.checked = false; updatePreview(); });
    }

    // Clear Citation Violation Buttons
    document.querySelectorAll("#citationViolationsList .clear-violation-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest(".violation-entry-row");
            const container = document.getElementById("citationViolationsList");
            if (container && container.querySelectorAll(".violation-entry-row").length > 3) {
                row.remove();
                renumberViolationRows("citationViolationsList");
            } else {
                const titleInput = row.querySelector(".violation-search-input");
                const typeSelect = row.querySelector("select");
                if (titleInput) titleInput.value = "";
                if (typeSelect) typeSelect.selectedIndex = 0;
                applyViolationClassification(row, null);
            }
            updatePreview();
        });
    });

    // Clear Arrest Charge Buttons
    document.querySelectorAll("#arrestChargesList .clear-arr-charge-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest(".violation-entry-row");
            const container = document.getElementById("arrestChargesList");
            if (container && container.querySelectorAll(".violation-entry-row").length > 3) {
                row.remove();
                renumberViolationRows("arrestChargesList");
            } else {
                const titleInput = row.querySelector(".violation-search-input");
                if (titleInput) titleInput.value = "";
                applyViolationClassification(row, null);
            }
            updatePreview();
        });
    });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Autocompletes for Citation Violations
    document.querySelectorAll("#citationViolationsList .violation-entry-row").forEach(row => {
        const input = row.querySelector(".violation-search-input");
        const results = row.querySelector(".violation-results");
        const typeSelect = row.querySelector("select");
        if (input && results) {
            setupViolationAutocomplete(input, results, typeSelect);
        }
    });

    // Autocompletes for Arrest Charges
    document.querySelectorAll("#arrestChargesList .violation-entry-row").forEach((row, idx) => {
        const input = row.querySelector(".violation-search-input");
        const results = row.querySelector(".violation-results");
        if (input && results) {
            setupViolationAutocomplete(input, results, null, idx + 1);
        }
    });

    initPillBehaviors();

    // Add Violation / Charge Buttons
    document.getElementById("addCitationViolationBtn")?.addEventListener("click", addCitationViolationRow);
    document.getElementById("addArrestChargeBtn")?.addEventListener("click", addArrestChargeRow);

    // Tab buttons
    document.getElementById("tabCitation")?.addEventListener("click", () => switchReportType("citation"));
    document.getElementById("tabArrest")?.addEventListener("click", () => switchReportType("arrest"));

    // Event listeners for real-time live preview update
    const formPanel = document.querySelector(".form-panel");
    if (formPanel) {
        formPanel.addEventListener("input", (e) => {
            syncOfficerInputs();
            updatePreview();
        });
        formPanel.addEventListener("change", (e) => {
            syncOfficerInputs();
            updatePreview();
        });
    }

    // Toolbar buttons
    document.getElementById("filldatetime")?.addEventListener("click", setCurrentDateTime);
    document.getElementById("loadSampleBtn")?.addEventListener("click", loadExampleData);
    document.getElementById("clearBtn")?.addEventListener("click", clearForm);
    document.getElementById("downloadBtn")?.addEventListener("click", downloadReport);
    document.getElementById("saveTxtBtn")?.addEventListener("click", downloadReport);
    document.getElementById("copyBtn")?.addEventListener("click", copyCitation);

    // Initial render
    updatePreview();
});

// ── Unsaved-data guard ────────────────────────────────────────────────────────
/**
 * Returns true if any meaningful field is filled in on either form section.
 * Intentionally excludes the officer credential inputs (callsign, rank, name)
 * since those are typically pre-set and don't represent active report work.
 */
function isFormFilled() {
    // Officer credential IDs to skip (default populated, not "report data")
    const skipIds = new Set([
        "officer_callsign", "officer_rank", "officer_name",
        "arr_officer_callsign", "arr_officer_rank", "arr_officer_name"
    ]);

    // Check all text inputs and textareas
    const inputs = document.querySelectorAll("input[type='text'], input[type='number'], textarea");
    for (const el of inputs) {
        if (skipIds.has(el.id)) continue;
        if (el.value && el.value.trim().length > 0) return true;
    }

    // Check checkboxes that are NOT checked by default in the HTML
    // We compare against a known list of always-default-checked IDs
    const defaultChecked = new Set([
        "arr_custodial_yes", "arr_miranda_yes", "arr_interp_no"
    ]);
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    for (const cb of checkboxes) {
        if (defaultChecked.has(cb.id)) continue;
        if (cb.checked) return true;
    }

    return false;
}

window.addEventListener("beforeunload", (e) => {
    if (isFormFilled()) {
        e.preventDefault();
        e.returnValue = ""; // Triggers the browser's built-in "Leave site?" dialog
    }
});

// ── Theme Toggle ──────────────────────────────────────────────────────────────
(function initTheme() {
    const root = document.documentElement;
    const btn  = document.getElementById("themeToggle");
    const label = btn?.querySelector(".theme-toggle-label");

    // Apply saved preference immediately (before first paint)
    const saved = localStorage.getItem("sasp-theme");
    if (saved === "light") root.setAttribute("data-theme", "light");

    function updateLabel() {
        const isLight = root.getAttribute("data-theme") === "light";
        if (label) label.textContent = isLight ? "Light" : "Dark";
    }

    updateLabel();

    btn?.addEventListener("click", () => {
        const isLight = root.getAttribute("data-theme") === "light";
        if (isLight) {
            root.removeAttribute("data-theme");
            localStorage.setItem("sasp-theme", "dark");
        } else {
            root.setAttribute("data-theme", "light");
            localStorage.setItem("sasp-theme", "light");
        }
        updateLabel();
    });
})();