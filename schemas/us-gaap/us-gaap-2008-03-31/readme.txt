This is the 2008-03-31 FINAL release of the XBRL US GAAP Taxonomies v1.0

(c) 2008 XBRL US Inc.  All rights reserved.

---technical information---

Entry point schemas are in these directories:

dis      = disclosures
elts	 = elements
ind	 = industries <<< DIRECTORY WHERE END USERS SHOULD ALWAYS START <<<
non-gaap = as it says
stm	 = statements
test     = test entry points; instance documents must not schemaRef files in this directory.

Abbreviations used in file names:

-std-	= load a 'minimal' taxonomy with no documentation or references
-all-	= load full taxonomy with documentation and references for concepts
-ent-	= load a non-gaap entry point with standard labels and linkbases

-dis-	= a disclosure schema or linkbase
-stm-	= a statement schema or linkbase

-sfp-	= statement of financial position
-soi-	= statement of income
-scf-	= statement of cash flows
-she-	= statement of shareholder equity
-scp-	= statement of partner capital

-bd-	= broker-dealer
-basi-	= banking and savings
-ci-	= commercial and industrial
-ins-	= insurance
-re-	= real estate

ar	= accounting report
exch	= Exchange codes
mr	= management report
dei	= document and entity information
mda	= management discussion and analysis
mr	= management report
seccert	= SEC certification
stpr	= State-Province codes
us-gaap	= GAAP taxonomy prefix

int, int1, int2...	
dbo, dbo1...
= The unnumbered is a main extended link, the numbered are alternative calculation sets with NO presentations.


-cal-	= calculation
-def-	= definition
-doc-	= documentation (contains xbrl labels having role "documentation")
-lab-	= labels (contains labels with 'standard' label role)
-pre-	= presentation
-ref-	= reference

The following schemas are provided only for testing:

us-gaap-entryPoint-std-2008-03-31.xsd loads all components except for docs and refs
us-gaap-entryPoint-all-2008-03-31.xsd loads all components.


---development build---

9597 - publish script 9598

---contact information----

email - USGAAP@xbrl.us 
