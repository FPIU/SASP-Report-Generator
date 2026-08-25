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
    }, 2800);
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

// Attach autocomplete to a violation/charge input field
function setupViolationAutocomplete(inputId, resultsId, typeSelectId, arrestRowIndex = null) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    const typeSelect = typeSelectId ? document.getElementById(typeSelectId) : null;
    if (!input || !results) return;

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        results.innerHTML = "";

        if (!query || query.length < 2) {
            return;
        }

        const matches = (typeof violations !== "undefined" ? violations : []).filter(v => 
            `${v.code} ${v.description}`.toLowerCase().includes(query)
        ).slice(0, 8);

        matches.forEach(item => {
            const row = document.createElement("div");
            row.className = "violation-option";

            const codeSpan = document.createElement("span");
            codeSpan.className = "violation-code-badge";
            codeSpan.textContent = item.code;

            const descSpan = document.createElement("span");
            descSpan.className = "violation-desc-text";
            descSpan.textContent = item.description;

            row.appendChild(codeSpan);
            row.appendChild(descSpan);

            row.addEventListener("click", () => {
                input.value = `${item.code} - ${item.description}`;

                // If citation dropdown
                if (typeSelect) {
                    if (item.misdemeanor) typeSelect.value = "Misd";
                    else if (item.infraction) typeSelect.value = "Inf";
                    else if (item.felony) typeSelect.value = "Felony";
                    else typeSelect.value = "Inf";
                }

                // If arrest charge row with Fel / Misd / Inf checkboxes
                if (arrestRowIndex) {
                    const fel = document.getElementById(`arr_c${arrestRowIndex}_fel`);
                    const misd = document.getElementById(`arr_c${arrestRowIndex}_misd`);
                    const inf = document.getElementById(`arr_c${arrestRowIndex}_inf`);

                    if (fel) fel.checked = Boolean(item.felony);
                    if (misd) misd.checked = Boolean(item.misdemeanor);
                    if (inf) inf.checked = Boolean(item.infraction);

                    if (!item.felony && !item.misdemeanor && !item.infraction) {
                        if (inf) inf.checked = true;
                    }
                }

                results.innerHTML = "";
                if (typeof updatePreview === "function") updatePreview();
            });

            results.appendChild(row);
        });
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.innerHTML = "";
        }
    });
}