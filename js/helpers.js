// SASP MDT Helpers & Interactive Utilities

function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// Single-choice pill group helper (makes a set of checkboxes behave like radio buttons or toggles)
function setupPillGroup(groupClass, allowNone = true) {
    const containers = document.querySelectorAll(groupClass);
    containers.forEach(container => {
        const checkboxes = container.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => {
            cb.addEventListener("change", () => {
                if (cb.checked) {
                    checkboxes.forEach(other => {
                        if (other !== cb) other.checked = false;
                    });
                } else if (!allowNone) {
                    cb.checked = true;
                }
                if (typeof updatePreview === "function") {
                    updatePreview();
                }
            });
        });
    });
}

let pendingFelonyItem = null;

/**
 * Display Internal Affairs Disciplinary Warning modal when Felony is selected for a Traffic Citation
 */
function showIaFelonyWarning(item = null, rowElement = null) {
    const modal = document.getElementById("iaWarningModal");
    if (!modal) {
        showToast("⚠️ IA WARNING: Felonies require custodial arrest!", "error");
        return;
    }

    pendingFelonyItem = item;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    // Close button
    const closeBtn = document.getElementById("iaModalCloseBtn");
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        };
    }

    // Dismiss button
    const dismissBtn = document.getElementById("iaDismissBtn");
    if (dismissBtn) {
        dismissBtn.onclick = () => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
            showToast("⚠️ IA WARNING: Felonies require custodial arrest!", "error");
        };
    }

    // Switch to Arrest Report button
    const switchBtn = document.getElementById("iaSwitchToArrestBtn");
    if (switchBtn) {
        switchBtn.onclick = () => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            if (typeof switchReportType === "function") {
                switchReportType("arrest");
            }

            // Populate charge in arrest report
            if (pendingFelonyItem) {
                const arrestContainer = document.getElementById("arrestChargesList");
                if (arrestContainer) {
                    const firstRow = arrestContainer.querySelector(".violation-entry-row");
                    if (firstRow) {
                        const titleInput = firstRow.querySelector(".violation-search-input");
                        if (titleInput) {
                            titleInput.value = `${pendingFelonyItem.code} - ${pendingFelonyItem.description}`;
                            applyViolationClassification(firstRow, pendingFelonyItem);
                        }
                    }
                }
            }

            if (typeof updatePreview === "function") updatePreview();
            showToast("Switched to Arrest Report", "success");
        };
    }
}

/**
 * Apply preset classification (Felony / Misdemeanor / Infraction) to a violation/charge row.
 * Automatically checks the appropriate level and locks/grays out buttons if preset.
 * Unlocks buttons if wobbler or custom.
 */
function applyViolationClassification(rowElement, item) {
    if (!rowElement) return;

    // Check if this is an Arrest charge row (has Fel/Misd/Inf checkboxes)
    const fel = rowElement.querySelector("input[id*='_fel'], input[data-type='fel']");
    const misd = rowElement.querySelector("input[id*='_misd'], input[data-type='misd']");
    const inf = rowElement.querySelector("input[id*='_inf'], input[data-type='inf']");
    const pillLabels = rowElement.querySelectorAll(".pill-btn");

    if (fel && misd && inf) {
        if (item) {
            const isFel = Boolean(item.felony);
            const isMisd = Boolean(item.misdemeanor);
            const isInf = Boolean(item.infraction);

            // Preset single-classification: lock/gray out buttons
            if (isFel && !isMisd && !isInf) {
                fel.checked = true;
                misd.checked = false;
                inf.checked = false;

                fel.disabled = true;
                misd.disabled = true;
                inf.disabled = true;

                pillLabels.forEach(l => l.classList.add("pill-locked"));
            } else if (isMisd && !isFel && !isInf) {
                fel.checked = false;
                misd.checked = true;
                inf.checked = false;

                fel.disabled = true;
                misd.disabled = true;
                inf.disabled = true;

                pillLabels.forEach(l => l.classList.add("pill-locked"));
            } else if (isInf && !isFel && !isMisd) {
                fel.checked = false;
                misd.checked = false;
                inf.checked = true;

                fel.disabled = true;
                misd.disabled = true;
                inf.disabled = true;

                pillLabels.forEach(l => l.classList.add("pill-locked"));
            } else if (isFel && isMisd) {
                // Wobbler charge (can be charged as Misdemeanor or Felony): keep buttons enabled so officer can choose
                fel.disabled = false;
                misd.disabled = false;
                inf.disabled = false;
                pillLabels.forEach(l => l.classList.remove("pill-locked"));

                if (!fel.checked && !misd.checked) {
                    misd.checked = true; // Default to Misdemeanor, selectable to Felony
                }
                inf.checked = false;
            } else {
                // Fallback
                fel.disabled = false;
                misd.disabled = false;
                inf.disabled = false;
                pillLabels.forEach(l => l.classList.remove("pill-locked"));
            }
        } else {
            // No item (custom text or cleared): unlock all buttons
            fel.disabled = false;
            misd.disabled = false;
            inf.disabled = false;
            pillLabels.forEach(l => l.classList.remove("pill-locked"));

            const textInput = rowElement.querySelector(".violation-search-input");
            if (!textInput || !textInput.value.trim()) {
                fel.checked = false;
                misd.checked = false;
                inf.checked = false;
            }
        }
    }

    // Check if this is a Citation violation row (has select dropdown)
    const typeSelect = rowElement.querySelector("select");
    const isCitationRow = Boolean(rowElement.closest("#citationViolationsList") || typeSelect);

    if (typeSelect && isCitationRow) {
        if (item) {
            if (item.felony && !item.misdemeanor) {
                typeSelect.value = "Felony";
                showIaFelonyWarning(item, rowElement);
            } else if (item.misdemeanor && !item.felony) {
                typeSelect.value = "Misd";
            } else if (item.infraction) {
                typeSelect.value = "Inf";
            } else if (item.felony && item.misdemeanor) {
                typeSelect.value = "Misd";
            }
        } else {
            const textInput = rowElement.querySelector(".violation-search-input");
            if (!textInput || !textInput.value.trim()) {
                typeSelect.value = "";
            }
        }
    }
}

/**
 * Fuzzy / Token search through violations database
 */
function findMatchingViolations(query) {
    const list = (typeof violations !== "undefined" && Array.isArray(violations)) ? violations : [];
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase().trim();
    const terms = q.split(/[\s,+/&|—\-]+/).filter(t => t.length > 0);

    return list.filter(v => {
        const combined = `${v.code} ${v.description} ${v.classification || ""}`.toLowerCase();
        
        // Exact substring match
        if (combined.includes(q)) return true;

        // All terms match
        if (terms.length > 1 && terms.every(t => combined.includes(t))) return true;

        // Code match (e.g. searching "4D.02" or "1A.01")
        const cleanCode = v.code.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanQ = q.replace(/[^a-z0-9]/g, '');
        if (cleanQ.length >= 3 && cleanCode.includes(cleanQ)) return true;

        return false;
    }).slice(0, 10);
}

/**
 * Attach autocomplete, classification detection, and auto-locking to a violation/charge row.
 * Supports passing either string element IDs or direct DOM element references.
 */
function setupViolationAutocomplete(inputTarget, resultsTarget, typeSelectTarget = null, arrestRowIndex = null) {
    const input = typeof inputTarget === "string" ? document.getElementById(inputTarget) : inputTarget;
    const results = typeof resultsTarget === "string" ? document.getElementById(resultsTarget) : resultsTarget;
    const typeSelect = typeof typeSelectTarget === "string" ? document.getElementById(typeSelectTarget) : typeSelectTarget;
    
    if (!input || !results) return;

    const rowElement = input.closest(".violation-entry-row");

    // Mutual exclusion on Fel / Misd / Inf checkboxes in this row (for arrest charges)
    if (rowElement) {
        const fel = rowElement.querySelector("input[id*='_fel'], input[data-type='fel']");
        const misd = rowElement.querySelector("input[id*='_misd'], input[data-type='misd']");
        const inf = rowElement.querySelector("input[id*='_inf'], input[data-type='inf']");
        const group = [fel, misd, inf].filter(Boolean);

        group.forEach(cb => {
            cb.onchange = () => {
                if (cb.checked) {
                    group.forEach(other => { if (other !== cb) other.checked = false; });
                }
                if (typeof updatePreview === "function") updatePreview();
            };
        });

        // Citation select change listener for Felony warning
        if (typeSelect) {
            typeSelect.onchange = () => {
                if (typeSelect.value === "Felony") {
                    const textVal = input.value.trim();
                    const match = (typeof violations !== "undefined" ? violations : []).find(v => 
                        textVal && `${v.code} - ${v.description}`.toLowerCase() === textVal.toLowerCase()
                    );
                    showIaFelonyWarning(match || { code: "FELONY", description: textVal || "Custom Charge", felony: true }, rowElement);
                }
                if (typeof updatePreview === "function") updatePreview();
            };
        }
    }

    input.addEventListener("input", () => {
        const query = input.value.trim();
        results.innerHTML = "";

        if (!query || query.length < 2) {
            if (!query) {
                applyViolationClassification(rowElement, null);
                if (typeof updatePreview === "function") updatePreview();
            }
            return;
        }

        // Check if current text is an exact match for any violation
        const exactMatch = (typeof violations !== "undefined" ? violations : []).find(v => 
            `${v.code} - ${v.description}`.toLowerCase() === query.toLowerCase() ||
            v.code.toLowerCase() === query.toLowerCase() ||
            v.description.toLowerCase() === query.toLowerCase()
        );

        if (exactMatch) {
            applyViolationClassification(rowElement, exactMatch);
        } else {
            // Custom text entered -> unlock buttons so user can select level manually
            applyViolationClassification(rowElement, null);
        }

        const matches = findMatchingViolations(query);

        matches.forEach(item => {
            const row = document.createElement("div");
            row.className = "violation-option";

            const codeSpan = document.createElement("span");
            codeSpan.className = "violation-code-badge";
            codeSpan.textContent = item.code;

            const descSpan = document.createElement("span");
            descSpan.className = "violation-desc-text";
            descSpan.textContent = item.description;

            // Classification badge
            const classSpan = document.createElement("span");
            let badgeClass = "badge-inf";
            const upperClass = (item.classification || "").toUpperCase();
            if (upperClass.includes("FELONY")) {
                badgeClass = "badge-fel";
            } else if (upperClass.includes("MISDEMEANOR")) {
                badgeClass = "badge-misd";
            }
            classSpan.className = `violation-class-badge ${badgeClass}`;
            classSpan.textContent = item.classification || (item.felony ? "FELONY" : item.misdemeanor ? "MISDEMEANOR" : "INFRACTION");

            row.appendChild(codeSpan);
            row.appendChild(descSpan);
            row.appendChild(classSpan);

            row.addEventListener("mousedown", (e) => {
                e.preventDefault(); // Prevent input blur before click registers
                input.value = `${item.code} - ${item.description}`;
                input.dataset.code = item.code;
                input.dataset.description = item.description;
                input.dataset.classification = item.classification || "";

                applyViolationClassification(rowElement, item);

                results.innerHTML = "";
                if (typeof updatePreview === "function") updatePreview();
            });

            results.appendChild(row);
        });
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            results.innerHTML = "";
        }, 200);
    });

    input.addEventListener("focus", () => {
        if (input.value.trim().length >= 2) {
            const matches = findMatchingViolations(input.value.trim());
            if (matches.length > 0) {
                input.dispatchEvent(new Event("input"));
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.innerHTML = "";
        }
    });
}