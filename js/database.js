// Built-in offline database of common California / San Andreas Vehicle and Penal Codes
const defaultViolations = [
    { code: "22349(a) VC", description: "Speeding - Exceeding 65 MPH Maximum Speed Limit", correctable: false, misdemeanor: false, infraction: true },
    { code: "22350 VC", description: "Basic Speed Law - Unsafe Speed for Conditions", correctable: false, misdemeanor: false, infraction: true },
    { code: "22356(b) VC", description: "Speeding - Exceeding 70 MPH Maximum Speed Limit", correctable: false, misdemeanor: false, infraction: true },
    { code: "21453(a) VC", description: "Failure to Stop at Red Signal / Light", correctable: false, misdemeanor: false, infraction: true },
    { code: "22450(a) VC", description: "Failure to Stop at Stop Sign", correctable: false, misdemeanor: false, infraction: true },
    { code: "23152(a) VC", description: "DUI - Driving Under the Influence of Alcohol", correctable: false, misdemeanor: true, infraction: false },
    { code: "23152(b) VC", description: "DUI - Driving with 0.08% BAC or Greater", correctable: false, misdemeanor: true, infraction: false },
    { code: "23152(f) VC", description: "DUI - Driving Under the Influence of Drugs", correctable: false, misdemeanor: true, infraction: false },
    { code: "23103(a) VC", description: "Reckless Driving on Highway with Willful Disregard", correctable: false, misdemeanor: true, infraction: false },
    { code: "2800.1(a) VC", description: "Evading Peace Officer in a Motor Vehicle", correctable: false, misdemeanor: true, infraction: false },
    { code: "2800.2(a) VC", description: "Reckless Evading Peace Officer (Felony Evading)", correctable: false, misdemeanor: true, infraction: false },
    { code: "20002(a) VC", description: "Hit and Run - Property Damage Only", correctable: false, misdemeanor: true, infraction: false },
    { code: "20001(a) VC", description: "Hit and Run Resulting in Injury / Death", correctable: false, misdemeanor: true, infraction: false },
    { code: "14601.1(a) VC", description: "Driving with Suspended or Revoked License", correctable: false, misdemeanor: true, infraction: false },
    { code: "12500(a) VC", description: "Unlicensed Driver / Driving Without Valid License", correctable: true, misdemeanor: false, infraction: true },
    { code: "4000(a)(1) VC", description: "Unregistered Vehicle / Expired Registration", correctable: true, misdemeanor: false, infraction: true },
    { code: "16028(a) VC", description: "Failure to Provide Proof of Financial Responsibility (Insurance)", correctable: true, misdemeanor: false, infraction: true },
    { code: "5200(a) VC", description: "Missing Front or Rear License Plate", correctable: true, misdemeanor: false, infraction: true },
    { code: "26708(a)(1) VC", description: "Obstructed View / Illegal Window Tint", correctable: true, misdemeanor: false, infraction: true },
    { code: "24250 VC", description: "Driving Without Headlamps During Darkness", correctable: true, misdemeanor: false, infraction: true },
    { code: "24601 VC", description: "Inoperable License Plate Lamp", correctable: true, misdemeanor: false, infraction: true },
    { code: "24600 VC", description: "Inoperable Tail Lamps / Brake Lights", correctable: true, misdemeanor: false, infraction: true },
    { code: "27315(d)(1) VC", description: "Failure to Wear Seat Belt (Driver / Passenger)", correctable: false, misdemeanor: false, infraction: true },
    { code: "23123.5(a) VC", description: "Operating Handheld Wireless Device While Driving", correctable: false, misdemeanor: false, infraction: true },
    { code: "22107 VC", description: "Unsafe Lane Change / Turning Without Signal", correctable: false, misdemeanor: false, infraction: true },
    { code: "21651(a) VC", description: "Driving Wrong Way on Divided Highway", correctable: false, misdemeanor: false, infraction: true },
    { code: "21703 VC", description: "Following Too Closely (Tailgating)", correctable: false, misdemeanor: false, infraction: true },
    { code: "21801(a) VC", description: "Failure to Yield Right-of-Way Left Turn / U-Turn", correctable: false, misdemeanor: false, infraction: true },
    { code: "22100(a) VC", description: "Improper Right Turn from Incorrect Lane", correctable: false, misdemeanor: false, infraction: true },
    { code: "22500 VC", description: "Prohibited Stopping / Parking in Red Zone or Highway", correctable: false, misdemeanor: false, infraction: true },
    { code: "27150(a) VC", description: "Adequate Muffler Required / Modified Loud Exhaust", correctable: true, misdemeanor: false, infraction: true },
    { code: "148(a)(1) PC", description: "Resisting, Delaying, or Obstructing a Peace Officer", correctable: false, misdemeanor: true, infraction: false },
    { code: "240 PC", description: "Simple Assault", correctable: false, misdemeanor: true, infraction: false },
    { code: "242 PC", description: "Battery on a Person", correctable: false, misdemeanor: true, infraction: false },
    { code: "243(b) PC", description: "Battery on a Peace Officer / Emergency Personnel", correctable: false, misdemeanor: true, infraction: false },
    { code: "245(a)(1) PC", description: "Assault with a Deadly Weapon (Not Firearm)", correctable: false, misdemeanor: true, infraction: false },
    { code: "245(a)(2) PC", description: "Assault with a Firearm", correctable: false, misdemeanor: true, infraction: false },
    { code: "459 PC", description: "Burglary - Commercial / Residential", correctable: false, misdemeanor: true, infraction: false },
    { code: "487(a) PC", description: "Grand Theft (Value Exceeding $950)", correctable: false, misdemeanor: true, infraction: false },
    { code: "488 PC", description: "Petty Theft", correctable: false, misdemeanor: true, infraction: false },
    { code: "10851(a) VC", description: "Unlawful Taking / Driving of a Vehicle (Grand Theft Auto)", correctable: false, misdemeanor: true, infraction: false },
    { code: "496(a) PC", description: "Receiving or Possessing Stolen Property", correctable: false, misdemeanor: true, infraction: false },
    { code: "211 PC", description: "Robbery by Force or Fear", correctable: false, misdemeanor: true, infraction: false },
    { code: "187(a) PC", description: "Homicide / Murder", correctable: false, misdemeanor: true, infraction: false },
    { code: "415(1) PC", description: "Disturbing the Peace - Unlawful Fighting in Public", correctable: false, misdemeanor: true, infraction: false },
    { code: "647(f) PC", description: "Disorderly Conduct - Public Intoxication", correctable: false, misdemeanor: true, infraction: false },
    { code: "602 PC", description: "Criminal Trespassing on Private Property", correctable: false, misdemeanor: true, infraction: false },
    { code: "594(a) PC", description: "Vandalism / Malicious Destruction of Property", correctable: false, misdemeanor: true, infraction: false },
    { code: "25400(a) PC", description: "Carrying a Concealed Firearm in Public", correctable: false, misdemeanor: true, infraction: false },
    { code: "25850(a) PC", description: "Carrying a Loaded Firearm in Public or Vehicle", correctable: false, misdemeanor: true, infraction: false },
    { code: "417(a)(1) PC", description: "Brandishing a Deadly Weapon in a Threatening Manner", correctable: false, misdemeanor: true, infraction: false },
    { code: "11350(a) H&S", description: "Possession of a Controlled Substance (Narcotics)", correctable: false, misdemeanor: true, infraction: false },
    { code: "11377(a) H&S", description: "Possession of Methamphetamine / Dangerous Substance", correctable: false, misdemeanor: true, infraction: false },
    { code: "11351 H&S", description: "Possession of Controlled Substance with Intent to Sell", correctable: false, misdemeanor: true, infraction: false }
];

let violations = [...defaultViolations];

async function loadViolations() {
    try {
        const response = await fetch("data/pc_vc.json");
        if (response.ok) {
            const externalData = await response.json();
            if (Array.isArray(externalData) && externalData.length > 0) {
                violations = externalData;
            }
        }
    } catch (e) {
        // Fallback to rich embedded defaults
        violations = [...defaultViolations];
    }
}

function searchViolations(input, results) {
    const search = input.value.toLowerCase().trim();
    results.innerHTML = "";

    if (!search) {
        return;
    }

    const matches = violations.filter(v =>
        `${v.code} ${v.description}`
            .toLowerCase()
            .includes(search)
    ).slice(0, 10); // Limit to top 10 matches for clean UI

    matches.forEach(v => {
        const option = document.createElement("div");
        option.className = "violation-option";
        
        const codeSpan = document.createElement("span");
        codeSpan.className = "violation-code-badge";
        codeSpan.textContent = v.code;

        const descSpan = document.createElement("span");
        descSpan.className = "violation-desc-text";
        descSpan.textContent = v.description;

        option.appendChild(codeSpan);
        option.appendChild(descSpan);

        option.addEventListener("mousedown", (e) => {
            e.preventDefault(); // Prevent input blur before click registers
            input.value = `${v.code} — ${v.description}`;
            input.violationData = v;
            results.innerHTML = "";
            updatePreview();
        });
        results.appendChild(option);
    });
}

function addViolationField(container) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "violation-input";
    input.placeholder = "Search violation code or type custom...";

    const results = document.createElement("div");
    results.className = "violation-results";

    const field = document.createElement("div");
    field.className = "violation-field";

    field.appendChild(input);
    field.appendChild(results);
    container.appendChild(field);

    input.violationData = null;

    input.addEventListener("input", () => {
        const text = input.value.trim();
        if (text) {
            // Check if exact match exists in violations
            const exact = violations.find(v => `${v.code} — ${v.description}`.toLowerCase() === text.toLowerCase());
            if (exact) {
                input.violationData = exact;
            } else {
                // Allow custom user input
                const parts = text.split("—").map(s => s.trim());
                input.violationData = {
                    code: parts[0] || text,
                    description: parts[1] || "",
                    correctable: false,
                    misdemeanor: false
                };
            }
        } else {
            input.violationData = null;
        }

        searchViolations(input, results);

        if (!input.value.trim() && field !== container.lastElementChild && container.children.length > 1) {
            field.remove();
        }
        updatePreview();
    });

    input.addEventListener("blur", () => {
        // Delay closing so mousedown on result option registers
        setTimeout(() => {
            results.innerHTML = "";
        }, 200);
    });

    input.addEventListener("focus", () => {
        if (input.value.trim()) {
            searchViolations(input, results);
        }
    });

    results.addEventListener("click", () => {
        setTimeout(() => {
            if (input.value.trim() && input.violationData && field === container.lastElementChild) {
                addViolationField(container);
            }
            updatePreview();
        }, 0);
    });
}