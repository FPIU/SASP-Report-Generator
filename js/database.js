// Built-in offline database of True Night RP (TNRP) Global Penal and Vehicle Codes
// Source: Official Server Penal Code Sheet (Titles 1A through 7G)

const defaultViolations = [
    {
        "code": "P.C. [1A.01.1]",
        "description": "ASSAULT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.01.2]",
        "description": "ASSAULT WITH A DEADLY WEAPON",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.02]",
        "description": "BATTERY",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.02.1]",
        "description": "ASSAULT OF A PEACE OFFICER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.03.1]",
        "description": "HOMICIDE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.04.1]",
        "description": "MURDER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.05.1]",
        "description": "ATTEMPTED MURDER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.05.2]",
        "description": "ATTEMPTED MURDER OF A GOVERNMENT OFFICIAL",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.06.1]",
        "description": "KIDNAPPING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.07]",
        "description": "CONSPIRACY",
        "classification": "MISDEMEANOR / FELONY",
        "felony": true,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.08.1]",
        "description": "VOLUNTARY MANSLUAGHTER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.08.2]",
        "description": "INVOLANTARY MANSLAUGHTER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.09]",
        "description": "CRIMINAL NEGLIGENCE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.10]",
        "description": "DOMESTIC VIOLENCE",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.11.1]",
        "description": "SEXUAL HARASSMENT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.11.2]",
        "description": "SEXUAL ASSAULT",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.12]",
        "description": "FALSE IMPRISONMENT",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.13]",
        "description": "VIOLATING A RESTRAINING ORDER",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.14]",
        "description": "CRIMINAL MISCHIEF",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.15]",
        "description": "Illegal immigration",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [1A.16]",
        "description": "VEHICULAR MANSLAUGHTER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [1A.17]",
        "description": "HARASSMENT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [2B.01]",
        "description": "EXTORTION",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.02.1]",
        "description": "EMBEZZLEMENT",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.03]",
        "description": "RACKETEERING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.04]",
        "description": "FORGERY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.05.1]",
        "description": "DESTRUCTION OF PROPERTY",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [2B.06]",
        "description": "MONEY LAUNDERING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.07.1]",
        "description": "PETTY THEFT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [2B.07.2]",
        "description": "THEFT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [2B.07.3]",
        "description": "GRAND THEFT",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.08]",
        "description": "KNOWINGLY RECEIVING STOLEN GOODS / POSSESSION OF STOLEN GOODS",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.09.1]",
        "description": "ROBBERY - STORES / PEOPLE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.09.2]",
        "description": "ROBBERY - BANK / JEWELRY STORE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [2B.10]",
        "description": "BURGLARY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.01.1]",
        "description": "GRAND THEFT AUTO",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.01.2]",
        "description": "ATTEMPTED GRAND THEFT AUTO",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.01.3]",
        "description": "CARJACKING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.02]",
        "description": "UNLAWFUL ASSEMBLY",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.03]",
        "description": "DISTURBING THE PEACE",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.04.1]",
        "description": "TRESPASSING",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.04.2]",
        "description": "TRESPASSING ON GOVERNMENT PROPERTY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.04.3]",
        "description": "TRESPASSING ON MILITARY PROPERTY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.05]",
        "description": "DISORDERLY CONDUCT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.06.1]",
        "description": "SOLICITATION OF PROSTITUTION",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.06.2]",
        "description": "PROSTITUTION",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [3C.07]",
        "description": "ARSON",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.08]",
        "description": "DOMESTIC TERRORISM",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.09]",
        "description": "PIMPING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [3C.10]",
        "description": "PUBLIC INTOXICATION",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [4D.01]",
        "description": "AIDING AND ABBETTING",
        "classification": "MISDEMEANOR / FELONY",
        "felony": true,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [4D.02]",
        "description": "FLEEING OR ATTEMPTING TO ELUDE A PEACE OFFICER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [4D.03]",
        "description": "RESISTING ARREST",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [4D.04]",
        "description": "FAILURE TO COMPLY WITH A PEACE OFFICER / OBSTRUCTION",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [4D.05]",
        "description": "IMPERSONATING A PEACE OFFICER",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [4D.06]",
        "description": "ESCAPING CUSTODY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [4D.07]",
        "description": "BRIBERY",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [4D.08]",
        "description": "PERJURY OR FALSIFYING INFORMATION",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [4D.09]",
        "description": "FAILURE TO APPEAR IN COURT",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [4D.10]",
        "description": "FAILURE TO IDENTIFY",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.01.1]",
        "description": "SPEEDING (1-5 MPH)",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.01.2]",
        "description": "SPEEDING (6-10 MPH)",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.01.3]",
        "description": "SPEEDING (11-15 MPH)",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.01.4]",
        "description": "SPEEDING (16-20 MPH)",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.01.5]",
        "description": "SPEEDING (21 MPH +)",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.01.6]",
        "description": "SPEEDING (30 MPH+)",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [5E.02]",
        "description": "LEAVING THE SCENE OF A VEHICLE ACCIDENT",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [5E.03.1]",
        "description": "DRIVING WITHOUT A LICENSE",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.03.2]",
        "description": "DRIVING A COMMERCIAL VEHICLE WITHOUT A CDL",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.03.3]",
        "description": "FAILURE TO REGISTER VEHICLE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.03.4]",
        "description": "FAILURE TO MAINTAIN REQUIRED INSURANCE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.04]",
        "description": "FAILURE TO MAINTAIN LANES",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.05]",
        "description": "UNSAFE PASSING",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.06]",
        "description": "FAILURE TO YIELD TO A TRAFFIC DEVICE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.07]",
        "description": "FAILURE TO YIELD TO THE RIGHT-OF-WAY",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.08]",
        "description": "FAILURE TO YIELD TO AN EMERGENCY VEHICLE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.09]",
        "description": "RECKLESS DRIVING",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.10]",
        "description": "DRIVING WHILE INTOXICATED",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [5E.11]",
        "description": "OBSTRUCTING A PUBLIC THOROUGHFARE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.12]",
        "description": "CARELESS DRIVING",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.13.1]",
        "description": "IMPROPER VEHICLE SAFETY EQUIPMENT",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.13.2]",
        "description": "OPERATING AN UNROADWORTHY VEHICLE ON A PUBLIC ROADWAY",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.14]",
        "description": "STREET RACING",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.15.1]",
        "description": "LIGHTING VIOLATION",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.15.2]",
        "description": "FAILURE TO MAINTAIN VISIBILITY STANDARDS",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.15.3]",
        "description": "OBSTRUCTION OF LICENSE PLATE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.16]",
        "description": "UNSAFE HAULING",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.17]",
        "description": "ILLEGAL U-TURN",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.18]",
        "description": "OPERATING A PRIVATELY OWNED ARMORED VEHICLE IN A PUBLIC ROAD",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [5E.19]",
        "description": "FAILURE TO WEAR SAFTEY BELT",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [5E.20]",
        "description": "PARKING IN A FIRE ZONE",
        "classification": "INFRACTION",
        "felony": false,
        "misdemeanor": false,
        "infraction": true
    },
    {
        "code": "P.C. [6F.01.1]",
        "description": "ILLEGAL POSSESSION OF HANDGUN",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.01.2]",
        "description": "POSSESSION OF ILLEGAL FIREARMS",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.01.3]",
        "description": "FELON IN POSSESSION OF FIREARM",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.01.4]",
        "description": "FELON IN POSSESSION OF DEADLY WEAPON",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.02]",
        "description": "ILLEGAL WEAPONS DEALING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.03]",
        "description": "WEAPONS TRAFFICKING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.04.1]",
        "description": "RECKLESS DISCHARGE OF FIREARM",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [6F.04.2]",
        "description": "CRIMINAL USE OF A WEAPON",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [6F.04.3]",
        "description": "OPEN CARRY OF WEAPONS",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [7G.01.1]",
        "description": "POSSESSION OF MARIJUANA",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [7G.01.2]",
        "description": "ILLEGAL CANNABIS CULTIVATION",
        "classification": "MISDEMEANOR",
        "felony": false,
        "misdemeanor": true,
        "infraction": false
    },
    {
        "code": "P.C. [7G.02.1]",
        "description": "POSSESSION OF CONTROLLED SUBSTANCE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [7G.02.2]",
        "description": "POSSESSION OF A CONTROLLED SUBSTANCE WITH INTENT TO DISTRIBUTE",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    },
    {
        "code": "P.C. [7G.02.3]",
        "description": "DRUG TRAFFICKING",
        "classification": "FELONY",
        "felony": true,
        "misdemeanor": false,
        "infraction": false
    }
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
