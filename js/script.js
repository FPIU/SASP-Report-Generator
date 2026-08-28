const preview = document.getElementById("preview");
const previewMeta = document.getElementById("previewMeta");
const previewTag = document.getElementById("previewTag");

let currentReportType = "citation";

const isChecked = (id) => Boolean(document.getElementById(id)?.checked);
const getValue = (id, fallback = "") => document.getElementById(id)?.value?.trim() || fallback;
const box = (condition) => (condition ? "[x]" : "[ ]");

function formatStopBasisRow(item1, checked1, item2, checked2, item3, checked3, otherText = "") {
    const col1 = `${box(checked1)} ${item1}`.padEnd(22, " ");
    const col2 = `${box(checked2)} ${item2}`.padEnd(22, " ");
    const col3 = item3 === "Other:"
        ? `${box(checked3)} Other:${otherText ? " " + otherText : ""}`
        : `${box(checked3)} ${item3}`;

    return `${col1}${col2}${col3}`;
}

function generateCadCitationText() {
    const dateVal = getValue("date");
    const timeVal = getValue("time");
    const postalVal = getValue("postal");
    const streetVal = getValue("street");

    const driverName = getValue("driver_name");
    const driverId = getValue("driver_id");

    const vehMake = getValue("veh_make");
    const vehColor = getValue("veh_color", document.getElementById("veh_color") ? "" : "Black");
    const vehPlate = getValue("veh_plate");
    const vehState = getValue("veh_state", document.getElementById("veh_state") ? "" : "SA");

    const otherBasisText = getValue("basis_other_text");

    const stopBasisLines = [
        formatStopBasisRow("Speed", isChecked("basis_speed"), "Stop Sign", isChecked("basis_stopsign"), "Fail to Yield", isChecked("basis_yield")),
        formatStopBasisRow("Improper Signal", isChecked("basis_signal"), "Lane/Unsafe Chg", isChecked("basis_lane"), "Following Close", isChecked("basis_following")),
        formatStopBasisRow("Right of Way", isChecked("basis_rightofway"), "Cell/Texting", isChecked("basis_cellphone"), "Seatbelt", isChecked("basis_seatbelt")),
        formatStopBasisRow("Equipment (lights)", isChecked("basis_equipment"), "Window Tint", isChecked("basis_tint"), "Loud Exhaust/Noise", isChecked("basis_exhaust")),
        formatStopBasisRow("Expired Reg/Plates", isChecked("basis_expiredreg"), "No Insurance", isChecked("basis_insurance"), "Exhibition Speed", isChecked("basis_exhibition")),
        formatStopBasisRow("School Zone", isChecked("basis_schoolzone"), "Work Zone", isChecked("basis_workzone"), "Yield (Emergency)", isChecked("basis_emergency_yield")),
        formatStopBasisRow("DUI/Impairment", isChecked("basis_dui"), "Documentation", isChecked("basis_documentation"), "Other:", isChecked("basis_other") || Boolean(otherBasisText), otherBasisText)
    ];

    const speedPosted = getValue("speed_posted");
    const speedAlleged = getValue("speed_alleged");
    const calibDate = getValue("calibration_date");

    const speedLine = `Posted: ${speedPosted ? speedPosted + " " : ""}Alleged: ${speedAlleged ? speedAlleged + " " : ""}Method: ${box(isChecked("speed_radar"))} RADAR ${box(isChecked("speed_lidar"))} LIDAR ${box(isChecked("speed_pace"))} Pace ${box(isChecked("speed_visual"))} Visual Est.`;
    const calibLine = `Calibration Date:${calibDate ? " " + calibDate : ""}`;
    const dirLine = `North ${box(isChecked("dir_north"))}   South ${box(isChecked("dir_south"))}   East ${box(isChecked("dir_east"))}    West ${box(isChecked("dir_west"))}  `;

    const citationEntries = document.querySelectorAll("#citationViolationsList .violation-entry-row");
    const violationLines = [];

    if (citationEntries.length > 0) {
        citationEntries.forEach(row => {
            const title = row.querySelector(".violation-search-input")?.value.trim() || "";
            const level = row.querySelector("select")?.value || "";
            violationLines.push(`Title: ${title}\t\tMisd/Inf:${level ? " " + level : ""}`);
        });
    } else {
        violationLines.push("Title: \t\tMisd/Inf:");
    }

    const fixitDue = getValue("fixit_due");
    const fixitStr = fixitDue ? `Fix-It (Due: ${fixitDue})` : "Fix-It (Due:)";
    const enfLine1 = `${box(isChecked("enf_citation"))} Citation ${box(isChecked("enf_written"))} Written Warning ${box(isChecked("enf_verbal"))} Verbal Warning ${box(isChecked("enf_fixit"))} ${fixitStr}`;

    const releasedTo = getValue("released_to");
    const enfLine2 = `Tow/Impound: ${box(isChecked("tow_yes"))} Yes ${box(isChecked("tow_no"))} No Released To:${releasedTo ? " " + releasedTo : ""}`;

    const callsign = (getValue("officer_callsign") || getValue("arr_officer_callsign")).trim();
    const rank = (getValue("officer_rank") || getValue("arr_officer_rank")).trim();
    const name = (getValue("officer_name") || getValue("arr_officer_name")).trim();

    const officerTitleName = [rank, name].filter(Boolean).join(" ");
    const badgeStr = callsign ? `Badge: ${callsign}` : "Badge:";
    const officerNameLine = `Name: ${officerTitleName ? officerTitleName + " " : ""}${badgeStr}`;
    const officerSigLine = `Signature: ${officerTitleName}`;

    const defSig = getValue("defendant_sig", document.getElementById("defendant_sig") ? "E-Signature" : "");
    const copyIssuedNo = isChecked("copy_issued_no");
    const notesVal = getValue("notes");

    return [
        "SAN ANDREAS STATE POLICE — TRAFFIC REPORT",
        "",
        `Date: \t${dateVal}`,
        `Time: ${timeVal || " "}`,
        `Location/Postal: ${postalVal}`,
        `Street/Road: ${streetVal}`,
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
        ...stopBasisLines,
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
        `Copy Issued: ${copyIssuedNo ? "[ ]" : "[x]"} Yes ${copyIssuedNo ? "[x]" : "[ ]"} No`,
        "",
        "",
        `Notes: ${notesVal}`
    ].join("\n");
}

function generateCadArrestText() {
    const dateVal = getValue("arr_date");
    const timeVal = getValue("arr_time");
    const postalVal = getValue("arr_postal");
    const streetVal = getValue("arr_street");

    const subjectName = getValue("arr_subject_name");
    const subjectId = getValue("arr_subject_id");
    const subjectSex = getValue("arr_subject_sex");
    const subjectRace = getValue("arr_subject_race");

    const vehMake = getValue("arr_veh_make");
    const vehColor = getValue("arr_veh_color");
    const vehPlate = getValue("arr_veh_plate");
    const vehOwner = getValue("arr_veh_owner");

    const warrantType = getValue("arr_warrant_type");
    const warrantCourt = getValue("arr_warrant_court");
    const warrantStr = `Warrant (Type/No.:${warrantType ? " " + warrantType : ""} Court:${warrantCourt ? " " + warrantCourt : ""} )`;
    const primaryPC = getValue("arr_primary_pc");

    const basisLine1 = `${box(isChecked("arr_basis_onview"))} On-View Offense ${box(isChecked("arr_basis_warrant"))} ${warrantStr}`;
    const basisLine2 = `${box(isChecked("arr_basis_pc"))} Probable Cause  ${box(isChecked("arr_basis_pursuit"))} Fresh Pursuit ${box(isChecked("arr_basis_parole"))} Parole/Probation Clause`;
    const basisLine3 = `Primary PC (reason): ${primaryPC}`;

    const chargeEntries = document.querySelectorAll("#arrestChargesList .violation-entry-row");
    const chargeLines = [];

    if (chargeEntries.length > 0) {
        chargeEntries.forEach(row => {
            const title = row.querySelector(".violation-search-input")?.value.trim() || "";
            const isFel = row.querySelector("input[id*='_fel'], input[data-type='fel']")?.checked;
            const isMisd = row.querySelector("input[id*='_misd'], input[data-type='misd']")?.checked;
            const isInf = row.querySelector("input[id*='_inf'], input[data-type='inf']")?.checked;

            chargeLines.push(`Title: ${title}\t\tCharge(s) Level: ${box(isFel)} Fel ${box(isMisd)} Misd ${box(isInf)} Inf`);
        });
    } else {
        chargeLines.push("Title: \t\tCharge(s) Level: [ ] Fel [ ] Misd [ ] Inf");
    }

    const mirandaExplain = getValue("arr_miranda_explain");
    const mirandaStr = mirandaExplain ? `(explain: ${mirandaExplain})` : "(explain):";
    const interpLang = getValue("arr_interp_lang");
    const interpStr = `(Language:${interpLang ? " " + interpLang : ""} )`;

    const searchLine = `Search Type: ${box(isChecked("arr_search_consent"))} Consent   ${box(isChecked("arr_search_pc"))} Probable Cause   ${box(isChecked("arr_search_incident"))} Incident to Arrest   ${box(isChecked("arr_search_patdown"))} Pat-Down   ${box(isChecked("arr_search_inventory"))} Inventory     ${box(isChecked("arr_search_warrant"))} Warrant           ${box(isChecked("arr_search_parole"))} Parole Violation Check   `;
    const propSeized = getValue("arr_property_seized", "N/A");

    const bodycamId = getValue("arr_bodycam_id", "AXOMMPA3KW9H");
    const dashcamId = getValue("arr_dashcam_id", "345376bnk2-00");
    const fieldResult = getValue("arr_fieldtest_text");
    const otherEvText = getValue("arr_other_ev_text");

    const evLine1 = `${box(isChecked("arr_ev_bodycam"))} Bodycam (ID:${bodycamId} ) ${box(isChecked("arr_ev_dashcam"))} Dashcam (ID:${dashcamId} ) ${box(isChecked("arr_ev_photos"))} Photos ${box(isChecked("arr_ev_video"))} Video ${box(isChecked("arr_ev_audio"))} Audio`;
    const evLine2 = `${box(isChecked("arr_ev_fieldtest"))} Field Tests (type/result):${fieldResult ? " " + fieldResult : ""}`;
    const evLine3 = `${box(isChecked("arr_ev_other"))} Other:${otherEvText ? " " + otherEvText : ""}`;

    const hasActiveForce = ["arr_force_holds", "arr_force_takedown", "arr_force_cew", "arr_force_oc", "arr_force_baton", "arr_force_lethal"].some(isChecked);
    const forceNoneChecked = isChecked("arr_force_none");
    const fNoneBox = box(hasActiveForce ? forceNoneChecked : forceNoneChecked);

    const forceLine = `Force Used: ${fNoneBox} None ${box(isChecked("arr_force_holds"))} Control Holds ${box(isChecked("arr_force_takedown"))} Takedown ${box(isChecked("arr_force_cew"))} CEW ${box(isChecked("arr_force_oc"))} OC ${box(isChecked("arr_force_baton"))} Baton ${box(isChecked("arr_force_lethal"))} Lethal Cover`;

    const hasActiveInj = ["arr_inj_subject", "arr_inj_officer", "arr_inj_third"].some(isChecked);
    const injNoneChecked = isChecked("arr_inj_none");
    const iNoneBox = box(hasActiveInj ? injNoneChecked : injNoneChecked);

    const injLine = `Injuries: ${iNoneBox} None ${box(isChecked("arr_inj_subject"))} Subject ${box(isChecked("arr_inj_officer"))} Officer ${box(isChecked("arr_inj_third"))} Third Party `;

    const medBy = getValue("arr_med_by");
    const medLine = `Medical Aid: ${box(isChecked("arr_med_declined"))} Declined ${box(isChecked("arr_med_provided"))} Provided (by:${medBy ? " " + medBy : ""} )`;
    const medFacility = getValue("arr_med_facility");

    const callsign = (getValue("arr_officer_callsign") || getValue("officer_callsign")).trim();
    const rank = (getValue("arr_officer_rank") || getValue("officer_rank")).trim();
    const name = (getValue("arr_officer_name") || getValue("officer_name")).trim();
    const officerTitleName = [rank, name].filter(Boolean).join(" ");

    const transportUnit = getValue("arr_transport_unit", officerTitleName ? `${officerTitleName}${callsign ? " | " + callsign : ""}` : "Deputy Chief D. Littin | S-05");
    const facility = getValue("arr_facility", "Grapeseed State Police Station ");

    const hasBookingType = ["arr_booked_cite", "arr_booked_detox", "arr_booked_guardian"].some(isChecked);
    const bookedYesBox = hasBookingType ? box(isChecked("arr_booked_yes")) : "[x]";
    const bookedLine = `Booked: ${bookedYesBox} Yes ${box(isChecked("arr_booked_cite"))} Cite & Release ${box(isChecked("arr_booked_detox"))} Detox/Med Clear then Book ${box(isChecked("arr_booked_guardian"))} Released to Guardian`;

    const hasRefOption = ["arr_ref_city", "arr_ref_probation", "arr_ref_other"].some(isChecked);
    const refDABox = hasRefOption ? box(isChecked("arr_ref_da")) : "[x]";
    const refOtherText = getValue("arr_ref_other_text");
    const caseRefLine = `Case Referred To: ${refDABox} DA ${box(isChecked("arr_ref_city"))} City Atty ${box(isChecked("arr_ref_probation"))} Probation ${box(isChecked("arr_ref_other"))} Other${refOtherText ? ": " + refOtherText : ""}`;

    const assisting = getValue("arr_assisting");
    const supervisor = getValue("arr_supervisor");
    const supervisorTime = getValue("arr_supervisor_time", "N/A");
    const completedAt = getValue("arr_completed_at");
    const narrative = getValue("arr_narrative");

    const custodialNo = isChecked("arr_custodial_no");
    const mirandaNo = isChecked("arr_miranda_no");
    const interpYes = isChecked("arr_interp_yes");

    return [
        "SAN ANDREAS STATE POLICE — ARREST REPORT",
        "",
        `Date: ${dateVal}`,
        `Time: ${timeVal || " "}`,
        `Location/Postal: ${postalVal}`,
        `Road/Street: ${streetVal}`,
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
        `Custodial? ${custodialNo ? "[ ]" : "[x]"} Yes ${custodialNo ? "[x]" : "[ ]"} No `,
        `Miranda Given: ${mirandaNo ? "[ ]" : "[x]"} Yes ${mirandaNo ? "[x]" : "[ ]"} No ${mirandaStr}`,
        `Statement: ${box(isChecked("arr_stmt_none"))} None ${box(isChecked("arr_stmt_verbal"))} Verbal ${box(isChecked("arr_stmt_written"))} Written ${box(isChecked("arr_stmt_recorded"))} Recorded`,
        `Interpreter Needed: ${interpYes ? "[ ]" : "[x]"} No ${interpYes ? "[x]" : "[ ]"} Yes ${interpStr}`,
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
        `Property Logged: ${box(isChecked("arr_property_logged_yes"))} Yes ${box(isChecked("arr_property_logged_no"))} No`,
        `Photos: ${box(isChecked("arr_photos_yes"))} Yes ${box(isChecked("arr_photos_no"))} No`,
        caseRefLine,
        "",
        "OFFICER INFORMATION:",
        `Reporting Officer: ${officerTitleName ? officerTitleName + " " : ""}Badge:${callsign || ""}`,
        `Assisting Officer(s): ${assisting}`,
        `Supervisor Notified: ${supervisor} Time: ${supervisorTime}`,
        `Signature: ${officerTitleName || ""}`,
        `Report Completed @:${completedAt ? " " + completedAt : ""}`,
        `NARRATIVE: ${narrative}`
    ].join("\n");
}

function updatePreview() {
    if (!preview) return;
    const reportText = currentReportType === "arrest" ? generateCadArrestText() : generateCadCitationText();
    preview.textContent = reportText;

    if (previewMeta) {
        const lineTotal = reportText.split("\n").length;
        const charTotal = reportText.length;
        previewMeta.textContent = `59 Col Monospace • ${lineTotal} Lines • ${charTotal} Chars`;
    }
}

function switchReportType(targetType) {
    currentReportType = targetType;

    const tabCitation = document.getElementById("tabCitation");
    const tabArrest = document.getElementById("tabArrest");
    const formCitation = document.getElementById("citationForm");
    const formArrest = document.getElementById("arrestForm");
    const titleHeader = document.getElementById("activeReportTitle");
    const descHeader = document.getElementById("activeReportDesc");

    const isArrest = targetType === "arrest";

    tabCitation?.classList.toggle("active", !isArrest);
    tabArrest?.classList.toggle("active", isArrest);

    if (formCitation) formCitation.style.display = isArrest ? "none" : "flex";
    if (formArrest) formArrest.style.display = isArrest ? "flex" : "none";

    if (titleHeader) titleHeader.textContent = isArrest ? "Arrest Report Generator" : "Traffic Report Generator";
    if (descHeader) descHeader.textContent = isArrest ? "SAN ANDREAS STATE POLICE — ARREST REPORT" : "SAN ANDREAS STATE POLICE — TRAFFIC REPORT";
    if (previewTag) previewTag.textContent = isArrest ? "ARREST REPORT" : "TRAFFIC REPORT";

    syncOfficerInputs();
    updatePreview();
}

function syncOfficerInputs() {
    const fields = ["callsign", "rank", "name"];
    fields.forEach(field => {
        const citeEl = document.getElementById(`officer_${field}`);
        const arrEl = document.getElementById(`arr_officer_${field}`);

        if (currentReportType === "arrest") {
            if (citeEl?.value && !arrEl?.value) arrEl.value = citeEl.value;
        } else {
            if (arrEl?.value && !citeEl?.value) citeEl.value = arrEl.value;
        }
    });
}

function copyCitation() {
    const output = preview?.textContent || "";
    if (!output.trim()) {
        showToast("Nothing to copy", "info");
        return;
    }

    const onCopySuccess = () => {
        showToast(`${currentReportType === "arrest" ? "Arrest Report" : "Citation"} copied to clipboard!`, "success");
        const btn = document.getElementById("copyBtn");
        if (btn) {
            const originalMarkup = btn.innerHTML;
            btn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Copied to Clipboard!
            `;
            setTimeout(() => { btn.innerHTML = originalMarkup; }, 1800);
        }
    };

    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(output).then(onCopySuccess).catch(() => fallbackCopy(output, onCopySuccess));
    } else {
        fallbackCopy(output, onCopySuccess);
    }
}

function fallbackCopy(text, callback) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand("copy");
        if (callback) callback();
    } catch (err) {
        showToast("Failed to copy", "error");
    } finally {
        document.body.removeChild(ta);
    }
}

function downloadReport() {
    const content = preview?.textContent || "";
    const today = new Date().toISOString().slice(0, 10);
    const label = currentReportType === "arrest" ? "ARREST_REPORT" : "CITATION";
    const targetFileName = `SASP_${label}_${today}.txt`;

    const blobPayload = new Blob([content], { type: "text/plain;charset=utf-8" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blobPayload);
    downloadAnchor.download = targetFileName;
    downloadAnchor.click();
    URL.revokeObjectURL(downloadAnchor.href);

    showToast(`Saved ${targetFileName}`, "success");
}

function setCurrentDateTime() {
    const current = new Date();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    const yyyy = current.getFullYear();
    const hh = String(current.getHours()).padStart(2, "0");
    const min = String(current.getMinutes()).padStart(2, "0");

    let zoneAbbreviation = "";
    try {
        zoneAbbreviation = new Intl.DateTimeFormat("en", { timeZoneName: "short" })
            .formatToParts(current)
            .find(part => part.type === "timeZoneName")?.value || "";
    } catch (e) { }

    const formattedTime = `${hh}:${min} Hrs${zoneAbbreviation ? " " + zoneAbbreviation : ""}`;
    const formattedDate = `${mm}/${dd}/${yyyy}`;

    const dateFieldId = currentReportType === "arrest" ? "arr_date" : "date";
    const timeFieldId = currentReportType === "arrest" ? "arr_time" : "time";

    const dInput = document.getElementById(dateFieldId);
    const tInput = document.getElementById(timeFieldId);
    if (dInput) dInput.value = formattedDate;
    if (tInput) tInput.value = formattedTime;

    showToast(`Date & time filled (${zoneAbbreviation || "local"})`, "success");
    updatePreview();
}

function renumberViolationRows(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    root.querySelectorAll(".violation-entry-row").forEach((entry, i) => {
        const badge = entry.querySelector(".violation-row-num");
        if (badge) badge.textContent = `#${i + 1}`;
        entry.dataset.index = String(i + 1);
    });
}

function addCitationViolationRow() {
    const list = document.getElementById("citationViolationsList");
    if (!list) return;

    const rowIdx = list.querySelectorAll(".violation-entry-row").length + 1;
    const entry = document.createElement("div");
    entry.className = "violation-entry-row";
    entry.dataset.index = String(rowIdx);

    entry.innerHTML = `
        <div class="violation-row-num">#${rowIdx}</div>
        <div class="violation-search-box">
            <input type="text" id="v${rowIdx}_title" class="form-input violation-search-input"
                placeholder="Violation ${rowIdx} (optional)..." autocomplete="off">
            <div id="v${rowIdx}_results" class="violation-results"></div>
        </div>
        <div class="violation-type-box">
            <select id="v${rowIdx}_type" class="form-select">
                <option value="">-- MISD / INF / FEL --</option>
                <option value="Inf">Infraction (Inf)</option>
                <option value="Misd">Misdemeanor (Misd)</option>
                <option value="Felony">Felony</option>
            </select>
        </div>
        <button type="button" class="btn btn-outline btn-sm clear-violation-btn"
            data-target="${rowIdx}" title="Clear or remove violation">✕</button>
    `;

    list.appendChild(entry);

    const input = entry.querySelector(".violation-search-input");
    const dropdown = entry.querySelector(".violation-results");
    const sel = entry.querySelector("select");
    const removeBtn = entry.querySelector(".clear-violation-btn");

    setupViolationAutocomplete(input, dropdown, sel);

    removeBtn.addEventListener("click", () => {
        if (list.querySelectorAll(".violation-entry-row").length > 3) {
            entry.remove();
            renumberViolationRows("citationViolationsList");
        } else {
            input.value = "";
            sel.selectedIndex = 0;
            applyViolationClassification(entry, null);
        }
        updatePreview();
    });

    input.focus();
    updatePreview();
}

function addArrestChargeRow() {
    const list = document.getElementById("arrestChargesList");
    if (!list) return;

    const rowIdx = list.querySelectorAll(".violation-entry-row").length + 1;
    const entry = document.createElement("div");
    entry.className = "violation-entry-row";
    entry.dataset.index = String(rowIdx);

    entry.innerHTML = `
        <div class="violation-row-num">#${rowIdx}</div>
        <div class="violation-search-box">
            <input type="text" id="arr_c${rowIdx}_title" class="form-input violation-search-input"
                placeholder="Charge ${rowIdx} (optional)..." autocomplete="off">
            <div id="arr_c${rowIdx}_results" class="violation-results"></div>
        </div>
        <div class="pill-group" style="flex-shrink:0;">
            <label class="pill-btn"><input type="checkbox" id="arr_c${rowIdx}_fel" data-type="fel"><span>Fel</span></label>
            <label class="pill-btn"><input type="checkbox" id="arr_c${rowIdx}_misd" data-type="misd"><span>Misd</span></label>
            <label class="pill-btn"><input type="checkbox" id="arr_c${rowIdx}_inf" data-type="inf"><span>Inf</span></label>
        </div>
        <button type="button" class="btn btn-outline btn-sm clear-arr-charge-btn"
            data-target="${rowIdx}" title="Clear or remove charge">✕</button>
    `;

    list.appendChild(entry);

    const input = entry.querySelector(".violation-search-input");
    const dropdown = entry.querySelector(".violation-results");
    const removeBtn = entry.querySelector(".clear-arr-charge-btn");

    setupViolationAutocomplete(input, dropdown, null, rowIdx);

    removeBtn.addEventListener("click", () => {
        if (list.querySelectorAll(".violation-entry-row").length > 3) {
            entry.remove();
            renumberViolationRows("arrestChargesList");
        } else {
            input.value = "";
            applyViolationClassification(entry, null);
        }
        updatePreview();
    });

    input.focus();
    updatePreview();
}

function clearForm() {
    const targetFormId = currentReportType === "arrest" ? "arrestForm" : "citationForm";
    const activeForm = document.getElementById(targetFormId);
    if (!activeForm) return;

    const preserveIds = new Set([
        "officer_callsign", "officer_rank", "officer_name",
        "arr_officer_callsign", "arr_officer_rank", "arr_officer_name"
    ]);

    activeForm.querySelectorAll("input, textarea, select").forEach(control => {
        if (preserveIds.has(control.id)) return;

        if (control.type === "checkbox") {
            control.checked = false;
            control.disabled = false;
        } else if (control.tagName === "SELECT") {
            control.selectedIndex = 0;
            control.disabled = false;
        } else {
            control.value = "";
        }
    });

    activeForm.querySelectorAll(".pill-btn").forEach(p => p.classList.remove("pill-locked"));

    const containerId = currentReportType === "arrest" ? "arrestChargesList" : "citationViolationsList";
    const container = document.getElementById(containerId);

    if (container) {
        const rows = container.querySelectorAll(".violation-entry-row");
        rows.forEach((r, idx) => {
            if (idx >= 3) r.remove();
        });
        renumberViolationRows(containerId);
    }

    updatePreview();
    showToast("Form cleared", "info");
}

function loadExampleData() {
    setCurrentDateTime();
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const setCheck = (id, state) => { const el = document.getElementById(id); if (el) el.checked = state; };

    if (currentReportType === "arrest") {
        const arrestValues = {
            arr_postal: "Postal 2044 / Grapeseed",
            arr_street: "Main St / Seaview Rd",
            arr_officer_callsign: "S-05",
            arr_officer_rank: "Deputy Chief",
            arr_officer_name: "D. Littin",
            arr_subject_name: "Trevor Philips",
            arr_subject_id: "OB52SOPC",
            arr_subject_sex: "M",
            arr_subject_race: "Caucasian",
            arr_veh_make: "Canis Bodhi",
            arr_veh_color: "Red",
            arr_veh_plate: "BETTY33",
            arr_veh_owner: "Trevor Philips",
            arr_primary_pc: "Suspect fled from marked SASP vehicle and was found in possession of illegal firearms.",
            arr_c1_title: "FLEEING OR ATTEMPTING TO ELUDE A PEACE OFFICER",
            arr_c2_title: "POSSESSION OF ILLEGAL FIREARMS",
            arr_c3_title: "RESISTING ARREST",
            arr_property_seized: "1x Vintage Pistol, 24 rounds 9mm, $420 cash",
            arr_bodycam_id: "AXOMMPA3KW9H",
            arr_dashcam_id: "345376bnk2-00",
            arr_transport_unit: "Deputy Chief D. Littin | S-05",
            arr_facility: "Grapeseed State Police Station",
            arr_supervisor: "S-23 LT. Jack Smith",
            arr_supervisor_time: "14:40",
            arr_completed_at: "15:30",
            arr_narrative: "I, S-05 DCHIEF. Littin was running radar at postal 360 on the median of Senora fwy when I noticed a black motorbike coming towards me at high speeds. I pointed my radar gun at the motorcycle which read 119 MPH, and when it passed me going into the Route 68 on-ramp, my car radar read 141 MPH. I immediately pulled out after the motorcycle and radio’d in for additionals, and the purple motorbike with no license plate and two occupants with zero protective gear pulled over on the bridge at postal 306 Westbound. The driver, Hazel Bazel, immediately began speaking, telling me that her license is suspended, that she is a felon, and that she is house hunting. After my additionals arrived, I ordered the rider off the bike and after running her name placed her under arrest. The passenger of the motorcycle was let go and the motorbike was county towed. The suspect was transported to 107 SASP Grapeseed station and booked with no further incident."
        };

        const arrestChecks = [
            "arr_basis_onview", "arr_basis_pc", "arr_custodial_yes", "arr_miranda_yes",
            "arr_stmt_verbal", "arr_interp_no", "arr_search_incident", "arr_ev_bodycam",
            "arr_ev_dashcam", "arr_force_holds", "arr_force_takedown", "arr_inj_none",
            "arr_med_declined", "arr_booked_yes", "arr_property_logged_yes", "arr_photos_yes",
            "arr_ref_da"
        ];

        Object.entries(arrestValues).forEach(([k, v]) => setVal(k, v));
        arrestChecks.forEach(id => setCheck(id, true));

        const cRows = document.querySelectorAll("#arrestChargesList .violation-entry-row");
        const matches = ["FLEEING", "ILLEGAL FIREARMS", "RESISTING"];
        cRows.forEach((row, i) => {
            if (matches[i]) {
                const found = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes(matches[i]));
                applyViolationClassification(row, found);
            }
        });

        showToast("Loaded sample arrest report", "success");
    } else {
        const citationValues = {
            postal: "Postal 1024 / Sandy Shores",
            street: "Joshua Road / Route 68",
            officer_callsign: "S-05",
            officer_rank: "Deputy Chief",
            officer_name: "D. Littin",
            driver_name: "Berry Doofus",
            driver_id: "OB52SOPC",
            veh_make: "Lamborghini Urus",
            veh_color: "Black",
            veh_plate: "TRVIP3R",
            veh_state: "SA",
            speed_posted: "75",
            speed_alleged: "90",
            calibration_date: "08/01/2026",
            v1_title: "SPEEDING (11-15 MPH)",
            v2_title: "FAILURE TO MAINTAIN LANES",
            notes: "I, Deputy Chief D. Littin, was on patrol duty running radar on the side of the highway at postal 313 right next to the Youtool when I spotted a BLACK LAMBORGHINI URUS speed past me SOUTHBOUND at what I clocked on my RADAR GUN to be 90 MPH in a 75 MPH zone. I pulled out behind the vehicle where I observed him failing to maintain the number two lane, and initiated a traffic stop right up the road at postal 360. The driver, Berry Doofus, very cooperative and apologetic, noting that he was just trying to get back home from a long day at work. The subject's driving record was decently clean except for a few prior traffic violations, however I decided to issue a citation to the subject for his speed and failure to maintain lanes, and he was released without further incident."
        };

        const citationChecks = ["basis_speed", "basis_lane", "basis_tint", "speed_radar", "dir_north", "enf_citation", "tow_no"];

        Object.entries(citationValues).forEach(([k, v]) => setVal(k, v));
        citationChecks.forEach(id => setCheck(id, true));

        const v1Row = document.querySelector("#citationViolationsList .violation-entry-row:nth-child(1)");
        const v2Row = document.querySelector("#citationViolationsList .violation-entry-row:nth-child(2)");

        if (v1Row) {
            const m1 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("SPEEDING (21"));
            applyViolationClassification(v1Row, m1);
        }
        if (v2Row) {
            const m2 = (typeof violations !== "undefined" ? violations : []).find(v => v.description.includes("MAINTAIN LANES"));
            applyViolationClassification(v2Row, m2);
        }

        showToast("Loaded sample traffic report", "success");
    }

    updatePreview();
}

function initPillBehaviors() {
    const bindExclusiveGroup = (elementIds) => {
        const pills = elementIds.map(id => document.getElementById(id)).filter(Boolean);
        pills.forEach(pill => {
            pill.addEventListener("change", () => {
                if (pill.checked) {
                    pills.filter(p => p !== pill).forEach(p => { p.checked = false; });
                }
                updatePreview();
            });
        });
    };

    const bindPairToggle = (yesId, noId) => {
        const yesEl = document.getElementById(yesId);
        const noEl = document.getElementById(noId);
        if (yesEl && noEl) {
            yesEl.addEventListener("change", () => { if (yesEl.checked) noEl.checked = false; updatePreview(); });
            noEl.addEventListener("change", () => { if (noEl.checked) yesEl.checked = false; updatePreview(); });
        }
    };

    bindExclusiveGroup(["speed_radar", "speed_lidar", "speed_pace", "speed_visual"]);
    bindExclusiveGroup(["dir_north", "dir_south", "dir_east", "dir_west"]);

    bindPairToggle("tow_yes", "tow_no");
    bindPairToggle("copy_issued_yes", "copy_issued_no");
    bindPairToggle("arr_miranda_yes", "arr_miranda_no");
    bindPairToggle("arr_custodial_yes", "arr_custodial_no");
    bindPairToggle("arr_interp_yes", "arr_interp_no");

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

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#citationViolationsList .violation-entry-row").forEach(row => {
        const input = row.querySelector(".violation-search-input");
        const results = row.querySelector(".violation-results");
        const typeSelect = row.querySelector("select");
        if (input && results) {
            setupViolationAutocomplete(input, results, typeSelect);
        }
    });

    document.querySelectorAll("#arrestChargesList .violation-entry-row").forEach((row, idx) => {
        const input = row.querySelector(".violation-search-input");
        const results = row.querySelector(".violation-results");
        if (input && results) {
            setupViolationAutocomplete(input, results, null, idx + 1);
        }
    });

    initPillBehaviors();

    document.getElementById("addCitationViolationBtn")?.addEventListener("click", addCitationViolationRow);
    document.getElementById("addArrestChargeBtn")?.addEventListener("click", addArrestChargeRow);

    document.getElementById("tabCitation")?.addEventListener("click", () => switchReportType("citation"));
    document.getElementById("tabArrest")?.addEventListener("click", () => switchReportType("arrest"));

    const formPanel = document.querySelector(".form-panel");
    if (formPanel) {
        const handleFormChange = () => {
            syncOfficerInputs();
            updatePreview();
        };
        formPanel.addEventListener("input", handleFormChange);
        formPanel.addEventListener("change", handleFormChange);
    }

    document.getElementById("filldatetime")?.addEventListener("click", setCurrentDateTime);
    document.getElementById("loadSampleBtn")?.addEventListener("click", loadExampleData);
    document.getElementById("clearBtn")?.addEventListener("click", clearForm);
    document.getElementById("downloadBtn")?.addEventListener("click", downloadReport);
    document.getElementById("saveTxtBtn")?.addEventListener("click", downloadReport);
    document.getElementById("copyBtn")?.addEventListener("click", copyCitation);

    updatePreview();
});

function isFormFilled() {
    const ignoreList = new Set([
        "officer_callsign", "officer_rank", "officer_name",
        "arr_officer_callsign", "arr_officer_rank", "arr_officer_name"
    ]);

    const activeInputs = document.querySelectorAll("input[type='text'], input[type='number'], textarea");
    for (const inp of activeInputs) {
        if (!ignoreList.has(inp.id) && inp.value?.trim().length > 0) return true;
    }

    const defaultStateBoxes = new Set(["arr_custodial_yes", "arr_miranda_yes", "arr_interp_no"]);
    const activeBoxes = document.querySelectorAll("input[type='checkbox']");
    for (const box of activeBoxes) {
        if (!defaultStateBoxes.has(box.id) && box.checked) return true;
    }

    return false;
}

window.addEventListener("beforeunload", (e) => {
    if (isFormFilled()) {
        e.preventDefault();
        e.returnValue = "";
    }
});

(function initTheme() {
    const docRoot = document.documentElement;
    const toggleBtn = document.getElementById("themeToggle");
    const statusLabel = toggleBtn?.querySelector(".theme-toggle-label");

    const preference = localStorage.getItem("sasp-theme");
    if (preference === "light") docRoot.setAttribute("data-theme", "light");

    const refreshThemeLabel = () => {
        const isCurrentLight = docRoot.getAttribute("data-theme") === "light";
        if (statusLabel) statusLabel.textContent = isCurrentLight ? "Light" : "Dark";
    };

    refreshThemeLabel();

    toggleBtn?.addEventListener("click", () => {
        const isCurrentLight = docRoot.getAttribute("data-theme") === "light";
        if (isCurrentLight) {
            docRoot.removeAttribute("data-theme");
            localStorage.setItem("sasp-theme", "dark");
        } else {
            docRoot.setAttribute("data-theme", "light");
            localStorage.setItem("sasp-theme", "light");
        }
        refreshThemeLabel();
    });
})();
