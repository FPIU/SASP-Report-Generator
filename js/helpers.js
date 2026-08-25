let pendingFelonyItem = null;

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
    requestAnimationFrame(() => toast.classList.add("toast-show"));

    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

function setupPillGroup(groupClass, allowNone = true) {
    document.querySelectorAll(groupClass).forEach(container => {
        const boxes = Array.from(container.querySelectorAll("input[type='checkbox']"));
        boxes.forEach(box => {
            box.addEventListener("change", () => {
                if (box.checked) {
                    boxes.filter(other => other !== box).forEach(other => { other.checked = false; });
                } else if (!allowNone) {
                    box.checked = true;
                }
                if (typeof updatePreview === "function") updatePreview();
            });
        });
    });
}

function showIaFelonyWarning(item = null, rowElement = null) {
    const modal = document.getElementById("iaWarningModal");
    if (!modal) {
        showToast("⚠️ IA WARNING: Felonies require custodial arrest!", "error");
        return;
    }

    pendingFelonyItem = item;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    const hideModal = () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    };

    const closeBtn = document.getElementById("iaModalCloseBtn");
    if (closeBtn) closeBtn.onclick = hideModal;

    const dismissBtn = document.getElementById("iaDismissBtn");
    if (dismissBtn) {
        dismissBtn.onclick = () => {
            hideModal();
            showToast("⚠️ IA WARNING: Felonies require custodial arrest!", "error");
        };
    }

    const switchBtn = document.getElementById("iaSwitchToArrestBtn");
    if (switchBtn) {
        switchBtn.onclick = () => {
            hideModal();

            if (typeof switchReportType === "function") {
                switchReportType("arrest");
            }

            if (pendingFelonyItem) {
                const arrestList = document.getElementById("arrestChargesList");
                const firstRow = arrestList?.querySelector(".violation-entry-row");
                const titleInput = firstRow?.querySelector(".violation-search-input");
                if (firstRow && titleInput) {
                    titleInput.value = `${pendingFelonyItem.code} - ${pendingFelonyItem.description}`;
                    applyViolationClassification(firstRow, pendingFelonyItem);
                }
            }

            if (typeof updatePreview === "function") updatePreview();
            showToast("Switched to Arrest Report", "success");
        };
    }
}

function applyViolationClassification(rowElement, item) {
    if (!rowElement) return;

    const fel = rowElement.querySelector("input[id*='_fel'], input[data-type='fel']");
    const misd = rowElement.querySelector("input[id*='_misd'], input[data-type='misd']");
    const inf = rowElement.querySelector("input[id*='_inf'], input[data-type='inf']");
    const pills = rowElement.querySelectorAll(".pill-btn");

    const resetPillStyles = (lbl) => {
        lbl.classList.remove("pill-locked", "pill-locked-felony", "pill-locked-misdemeanor", "pill-locked-infraction");
    };

    if (fel && misd && inf) {
        if (item) {
            const hasFel = Boolean(item.felony);
            const hasMisd = Boolean(item.misdemeanor);
            const hasInf = Boolean(item.infraction);

            if (hasFel && !hasMisd && !hasInf) {
                fel.checked = true;
                misd.checked = false;
                inf.checked = false;
                fel.disabled = misd.disabled = inf.disabled = true;

                pills.forEach(p => {
                    resetPillStyles(p);
                    p.classList.add("pill-locked");
                    if (p.querySelector("input")?.checked) p.classList.add("pill-locked-felony");
                });
            } else if (hasMisd && !hasFel && !hasInf) {
                fel.checked = false;
                misd.checked = true;
                inf.checked = false;
                fel.disabled = misd.disabled = inf.disabled = true;

                pills.forEach(p => {
                    resetPillStyles(p);
                    p.classList.add("pill-locked");
                    if (p.querySelector("input")?.checked) p.classList.add("pill-locked-misdemeanor");
                });
            } else if (hasInf && !hasFel && !hasMisd) {
                fel.checked = false;
                misd.checked = false;
                inf.checked = true;
                fel.disabled = misd.disabled = inf.disabled = true;

                pills.forEach(p => {
                    resetPillStyles(p);
                    p.classList.add("pill-locked");
                    if (p.querySelector("input")?.checked) p.classList.add("pill-locked-infraction");
                });
            } else if (hasFel && hasMisd) {
                fel.disabled = misd.disabled = inf.disabled = false;
                pills.forEach(resetPillStyles);
                if (!fel.checked && !misd.checked) misd.checked = true;
                inf.checked = false;
            } else {
                fel.disabled = misd.disabled = inf.disabled = false;
                pills.forEach(resetPillStyles);
            }
        } else {
            fel.disabled = misd.disabled = inf.disabled = false;
            pills.forEach(resetPillStyles);

            const searchInp = rowElement.querySelector(".violation-search-input");
            if (!searchInp?.value.trim()) {
                fel.checked = misd.checked = inf.checked = false;
            }
        }
    }

    const typeSelect = rowElement.querySelector("select");
    const isCitationRow = Boolean(rowElement.closest("#citationViolationsList") || typeSelect);

    if (typeSelect && isCitationRow) {
        const resetSelectStyles = () => {
            typeSelect.classList.remove("select-locked", "select-locked-felony", "select-locked-misdemeanor", "select-locked-infraction");
        };

        if (item) {
            if (item.felony && !item.misdemeanor) {
                typeSelect.value = "Felony";
                typeSelect.disabled = true;
                resetSelectStyles();
                typeSelect.classList.add("select-locked", "select-locked-felony");
                showIaFelonyWarning(item, rowElement);
            } else if (item.misdemeanor && !item.felony) {
                typeSelect.value = "Misd";
                typeSelect.disabled = true;
                resetSelectStyles();
                typeSelect.classList.add("select-locked", "select-locked-misdemeanor");
            } else if (item.infraction && !item.felony && !item.misdemeanor) {
                typeSelect.value = "Inf";
                typeSelect.disabled = true;
                resetSelectStyles();
                typeSelect.classList.add("select-locked", "select-locked-infraction");
            } else if (item.felony && item.misdemeanor) {
                typeSelect.value = "Misd";
                typeSelect.disabled = false;
                resetSelectStyles();
            } else {
                typeSelect.disabled = false;
                resetSelectStyles();
            }
        } else {
            const searchInp = rowElement.querySelector(".violation-search-input");
            if (!searchInp?.value.trim()) {
                typeSelect.value = "";
            }
            typeSelect.disabled = false;
            resetSelectStyles();
        }
    }
}

function findMatchingViolations(query) {
    const list = (typeof violations !== "undefined" && Array.isArray(violations)) ? violations : [];
    if (!query || query.length < 2) return [];

    const normQuery = query.toLowerCase().trim();
    const tokens = normQuery.split(/[\s,+/&|—\-]+/).filter(Boolean);
    const cleanAlphaQuery = normQuery.replace(/[^a-z0-9]/g, "");

    return list.filter(v => {
        const fullText = `${v.code} ${v.description} ${v.classification || ""}`.toLowerCase();
        if (fullText.includes(normQuery)) return true;
        if (tokens.length > 1 && tokens.every(t => fullText.includes(t))) return true;

        const cleanCode = v.code.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanAlphaQuery.length >= 3 && cleanCode.includes(cleanAlphaQuery)) return true;

        return false;
    }).slice(0, 10);
}

function setupViolationAutocomplete(inputTarget, resultsTarget, typeSelectTarget = null, arrestRowIndex = null) {
    const input = typeof inputTarget === "string" ? document.getElementById(inputTarget) : inputTarget;
    const results = typeof resultsTarget === "string" ? document.getElementById(resultsTarget) : resultsTarget;
    const typeSelect = typeof typeSelectTarget === "string" ? document.getElementById(typeSelectTarget) : typeSelectTarget;

    if (!input || !results) return;

    const row = input.closest(".violation-entry-row");

    if (row) {
        const fel = row.querySelector("input[id*='_fel'], input[data-type='fel']");
        const misd = row.querySelector("input[id*='_misd'], input[data-type='misd']");
        const inf = row.querySelector("input[id*='_inf'], input[data-type='inf']");
        const levelGroup = [fel, misd, inf].filter(Boolean);

        levelGroup.forEach(box => {
            box.onchange = () => {
                if (box.checked) {
                    levelGroup.filter(other => other !== box).forEach(other => { other.checked = false; });
                }
                if (typeof updatePreview === "function") updatePreview();
            };
        });

        if (typeSelect) {
            typeSelect.onchange = () => {
                if (typeSelect.value === "Felony") {
                    const text = input.value.trim();
                    const dataset = (typeof violations !== "undefined" ? violations : []);
                    const found = dataset.find(v => text && v.description.toLowerCase() === text.toLowerCase());
                    showIaFelonyWarning(found || { code: "FELONY", description: text || "Custom Charge", felony: true }, row);
                }
                if (typeof updatePreview === "function") updatePreview();
            };
        }
    }

    const renderOption = (item) => {
        const opt = document.createElement("div");
        opt.className = "violation-option";

        const title = document.createElement("span");
        title.className = "violation-desc-text";
        title.textContent = item.description;

        const badge = document.createElement("span");
        const upperClass = (item.classification || "").toUpperCase();
        let badgeVariant = "badge-inf";

        if (upperClass.includes("FELONY") || item.felony) {
            badgeVariant = "badge-fel";
        } else if (upperClass.includes("MISDEMEANOR") || item.misdemeanor) {
            badgeVariant = "badge-misd";
        }

        badge.className = `violation-class-badge ${badgeVariant}`;
        badge.textContent = item.classification || (item.felony ? "FELONY" : item.misdemeanor ? "MISDEMEANOR" : "INFRACTION");

        opt.appendChild(title);
        opt.appendChild(badge);

        opt.addEventListener("mousedown", (e) => {
            e.preventDefault();
            input.value = item.description;
            input.dataset.description = item.description;
            input.dataset.classification = item.classification || "";

            applyViolationClassification(row, item);
            results.innerHTML = "";
            if (typeof updatePreview === "function") updatePreview();
        });

        return opt;
    };

    input.addEventListener("input", () => {
        const query = input.value.trim();
        results.innerHTML = "";

        if (!query || query.length < 2) {
            if (!query) {
                applyViolationClassification(row, null);
                if (typeof updatePreview === "function") updatePreview();
            }
            return;
        }

        const exact = (typeof violations !== "undefined" ? violations : []).find(v =>
            v.description.toLowerCase() === query.toLowerCase()
        );

        applyViolationClassification(row, exact || null);

        const matches = findMatchingViolations(query);
        matches.forEach(item => results.appendChild(renderOption(item)));
    });

    input.addEventListener("blur", () => {
        setTimeout(() => { results.innerHTML = ""; }, 200);
    });

    input.addEventListener("focus", () => {
        const val = input.value.trim();
        if (val.length >= 2) {
            const matches = findMatchingViolations(val);
            if (matches.length > 0) input.dispatchEvent(new Event("input"));
        }
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.innerHTML = "";
        }
    });
}
