Unzip this anywhere, e.g. c:\temp, preserving the folder hierarchy.

rr is the root and has subdirectories 2006, topics, samples, and docs.

2006 contains a copy of the XBRLUS-rr taxonomy proper.

2006\listing contains a set of HTML files for reviewing the taxonomy elements.

docs contains architecture and requirements documents for the project, and a technical
guide for implementation of the taxonomy

topics contains three subdirectories, one for each of the topic
taxonomies (obj, str, rsk).

samples contains two subdirectories (arctangent, bounty) with some 
sample instances of fictitious fund families.

instances a-2006-10-01.xml and b-2006-10-01.xml do not use the topic 
taxonomies; aa-2006-10-01.xml and bb-2006-10-01.xml do.  The -template.xml
files are "empty" instances containing all necessary contexts.

any directory named 'edgar' contains a complete set of files that have been modified
to only refer to each other; this is necessary as a temporary measure for EDGAR filing
have been made available within the EDGAR system itself.  EDGAR format .xfd files have
also been provided as samples.


------------------

These files are distributed in the hope that they will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.