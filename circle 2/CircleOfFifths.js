/* Copyright (c) 2007 Rand Scullard. All Rights Reserved. */

// The currently selected tonic in the tonic table.
var g_sSelTonic = "C";

// The currently selected mode in the mode table.
var g_sSelMode = "ionian";

// When the user is dragging the mouse in one of the tables, this is the ID of that table.
var g_sDraggingTable = null;

// Hash table of key signatures, where the key is the number of sharps (positive) or flats (negative).
// The value is an array of note names in the key signature, starting at the 1:00 clock position
// and ending at the 12:00 position.
var g_dKeySignatures = 
{
	"-13" : [ "Abb", "Ebb", "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Cbb", "Gbb", "Dbb" ],
	"-12" : [ "Abb", "Ebb", "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "Gbb", "Dbb" ],
	"-11" : [ "Abb", "Ebb", "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "Dbb" ],
	"-10" : [ "Abb", "Ebb", "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-9"  : [ "G",   "Ebb", "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-8"  : [ "G",   "D",   "Bbb", "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-7"  : [ "G",   "D",   "A",   "Fb",  "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-6"  : [ "G",   "D",   "A",   "E",   "Cb",  "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-5"  : [ "G",   "D",   "A",   "E",   "B",   "Gb",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-4"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-3"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-2"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	"-1"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	 "0"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	 "1"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "Db", "Ab", "Eb", "Bb",  "F",   "C"   ],
	 "2"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "Ab", "Eb", "Bb",  "F",   "C"   ],
	 "3"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "Eb", "Bb",  "F",   "C"   ],
	 "4"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "Bb",  "F",   "C"   ],
	 "5"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "F",   "C"   ],
	 "6"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "C"   ],
	 "7"  : [ "G",   "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "8"  : [ "F##", "D",   "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "9"  : [ "F##", "C##", "A",   "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "10" : [ "F##", "C##", "G##", "E",   "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "11" : [ "F##", "C##", "G##", "D##", "B",   "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "12" : [ "F##", "C##", "G##", "D##", "A##", "F#",  "C#", "G#", "D#", "A#",  "E#",  "B#"  ],
	 "13" : [ "F##", "C##", "G##", "D##", "A##", "E##", "C#", "G#", "D#", "A#",  "E#",  "B#"  ]
};																															   

// Array of scale degrees in the Lydian mode, starting at the first note position on the
// circle and proceeding clockwise. Modes other than Lydian are simply rotations of this array by 
// the number of steps specified by g_dModeInfo.m_nOffset. 
var g_aDegrees = [1, 5, 2, 6, 3, 7, 4];

// Hash table of information on each tonic that can be selected by the user, where the key is
// the tonic itself, and the value has two pieces of info: m_nPos is the clock position on the
// circle where the notes of the Lydian mode begin for that tonic. m_nSig is the key signature
// in the g_dKeySignatures table for that tonic in the Lydian mode. (The g_dModeInfo table
// is used to translate this info into modes other than Lydian.)
var g_dTonicInfo =
{
	"B#" : { m_nPos:12, m_nSig:13 },
	"E#" : { m_nPos:11, m_nSig:12 },
	"A#" : { m_nPos:10, m_nSig:11 },
	"D#" : { m_nPos:9,  m_nSig:10 },
	"G#" : { m_nPos:8,  m_nSig:9  },
	"C#" : { m_nPos:7,  m_nSig:8  },
	"F#" : { m_nPos:6,  m_nSig:7  },
	"B"  : { m_nPos:5,  m_nSig:6  },
	"E"  : { m_nPos:4,  m_nSig:5  },
	"A"  : { m_nPos:3,  m_nSig:4  },
	"D"  : { m_nPos:2,  m_nSig:3  },
	"G"  : { m_nPos:1,  m_nSig:2  },
	"C"  : { m_nPos:12, m_nSig:1  },
	"F"  : { m_nPos:11, m_nSig:0  },
	"Bb" : { m_nPos:10, m_nSig:-1 },
	"Eb" : { m_nPos:9,  m_nSig:-2 },
	"Ab" : { m_nPos:8,  m_nSig:-3 },
	"Db" : { m_nPos:7,  m_nSig:-4 },
	"Gb" : { m_nPos:6,  m_nSig:-5 },
	"Cb" : { m_nPos:5,  m_nSig:-6 },
	"Fb" : { m_nPos:4,  m_nSig:-7 }
};

// Hash table of information on each mode that can be selected by the user, where the key is
// the mode itself, and the m_nOffset value has the number of steps counterclockwise around
// the circle where the mode begins, relative to Lydian. For example, if the Lydian begins
// at 3:00, then the Mixolydian of the same tonic begins at 1:00.
var g_dModeInfo =
{
	"lydian"     : { m_nOffset:0 },
	"ionian"     :	{ m_nOffset:-1 },
	"mixolydian" :	{ m_nOffset:-2 },
	"dorian"     :	{ m_nOffset:-3 },
	"aeolian"    :	{ m_nOffset:-4 },
	"phrygian"   :	{ m_nOffset:-5 },
	"locrian"    :	{ m_nOffset:-6 }
};


function OnPageLoad(
	oEvent)
{
	try
	{
		OnPageLoadImpl(oEvent);
	}
	catch(oErr)
	{
		// If anything at all went wrong, we probably don't support this browser.
		// Throw up our hands and go to the problem page.
		window.location = "ProblemLoading.htm";
	}
}

function OnPageLoadImpl(
	oEvent)
{
	// Convert the accidentals in the tonic table to images.
	FixTonicAccidentals();
	
	// Set up the circle with the initial settings.
	FillCircle();
	
	// Turn on the selection indicators in the two tables.
	ShowSelectedCell(document.getElementById("TonicTable"), g_sSelTonic);
	ShowSelectedCell(document.getElementById("ModeTable"), g_sSelMode);
	
	// The page content starts out hidden; now we can show it.
	document.getElementById("LoadingMessage").style.display = "none";
	document.getElementById("PageContent").style.display = "";
}

function OnPageMouseUp(
	oEvent)
{
	// No matter where on the page the user released the mouse, turn off dragging mode.
	g_sDraggingTable = null;
}

function OnPageMouseOut(
	oEvent)
{
	// Find out what element the mouse has moved TO.
	var oToElem = GetMouseOutEventToElem(oEvent);

	// Special case when the mouse moves outside the browser: oToElem will be null, which
	// is our signal to turn off dragging mode (we'll lose track of mouse events now that
	// the mouse is no longer over the browser).	
	if(oToElem == null)
		g_sDraggingTable = null;
}

function OnTonicMouseover(
	oEvent)
{
	// If the user's dragging on the tonic table, change the selected tonic.
	if(g_sDraggingTable == "TonicTable")
		TonicMouseSelect(oEvent);
}

function OnModeMouseover(
	oEvent)
{
	// If the user's dragging on the mode table, change the selected tonic.
	if(g_sDraggingTable == "ModeTable")
		ModeMouseSelect(oEvent);
}

function OnTonicMousedown(
	oEvent)
{
	// Activate dragging mode and change the selected tonic.
	g_sDraggingTable = "TonicTable";
	TonicMouseSelect(oEvent);
}

function OnModeMousedown(
	oEvent)
{
	// Activate dragging mode and change the selected mode.
	g_sDraggingTable = "ModeTable";
	ModeMouseSelect(oEvent);
}

function TonicMouseSelect(
	oEvent)
{
	// Figure out which table cell was selected (if any).
	var oTable = document.getElementById("TonicTable");
	var oSrcElem = FindParentByTag(GetEventSrcElem(oEvent), "TD");
	if(oSrcElem == null)
		return;

	// Get the tonic from the table cell (if any).	
	var sTonic = oSrcElem.getAttribute("rds_value");
	if(sTonic == null)
		return;

	// Update the selection state.		
	ShowSelectedCell(oTable, sTonic);

	// Update the circle.	
	g_sSelTonic = sTonic;
	FillCircle();
}

function ModeMouseSelect(
	oEvent)
{
	// Figure out which table cell was selected (if any).
	var oTable = document.getElementById("ModeTable");
	var oSrcElem = FindParentByTag(GetEventSrcElem(oEvent), "TD");
	if(oSrcElem == null)
		return;

	// Get the mode from the table cell (if any).	
	var sMode = oSrcElem.getAttribute("rds_value");
	if(sMode == null)
		return;

	// Update the selection state.		
	ShowSelectedCell(oTable, sMode);

	// Update the circle.	
	g_sSelMode = sMode;
	FillCircle();
}

function FixTonicAccidentals()
{
	// Walk through the tonic names in the tonic table and replace the accidental
	// symbols (e.g. "#") with their corresponding images.
	var oTable = document.getElementById("TonicTable");
	for(var nRow = 0; nRow < oTable.rows.length; ++nRow)
	{
		var oCell = oTable.rows[nRow].cells[0];
		oCell.innerHTML = InsertAccidentalImages(oCell.innerHTML, 15);
	}
}

function FillCircle()
{
	// Grab the info for the selected tonic.
	var oTonicInfo = g_dTonicInfo[g_sSelTonic];
	if(oTonicInfo == null)
	{
		// This should never happen.
		window.alert("Tonic " + g_sSelTonic + " not found!");
		return;
	}
	
	// Grab the info for the selected mode.
	var oModeInfo = g_dModeInfo[g_sSelMode];
	if(oModeInfo == null)
	{
		// This should never happen.
		window.alert("Mode " + g_sSelMode + " not found!");
		return;
	}
	
	var nModeOffset = oModeInfo.m_nOffset;

	// Grab the info for the key signature corresponding to the selected tonic/mode.
	var nKeySigIndex = oTonicInfo.m_nSig + nModeOffset;
	var aKeySignature = g_dKeySignatures[nKeySigIndex];
	if(aKeySignature == null)
	{
		// This should never happen.
		window.alert("Key signature " + nKeySigIndex + " not found!");
		return;
	}

	// Set up the circle's defaults...
	// For each clock position on the circle
	for(var nPos = 1; nPos <= 12; ++nPos)
	{
		// Fill in the note name at this clock position with the name specified
		// in the key signature. (Convert accidental text to images.)
		var oNote = document.getElementById("Note_" + nPos);
		oNote.innerHTML = InsertAccidentalImages(aKeySignature[nPos - 1], 43);

		// Display the gray background by default (we'll hide it as needed later).
		var oGrayImg = document.getElementById("Gray_" + nPos);
		oGrayImg.style.visibility = "";

		// Hide the modes/degrees ring image by default (we'll display it as needed later).
		var oModesDegreesImg = document.getElementById("ModesDegrees_" + nPos);
		oModesDegreesImg.style.visibility = "hidden";

		// Hide the degree name by default (we'll display it as needed later).
		var oDegree = document.getElementById("Degree_" + nPos);
		oDegree.style.visibility = "hidden";

		// Hide the tonic arrow by default (we'll display it as needed later).
		var oTonicArrow = document.getElementById("TonicArrow_" + nPos);
		oTonicArrow.style.visibility = "hidden";
	}
	
	// Make a copy of the array of scale degrees, so we can manipulate it.	
	var aDegrees = new Array();
	aDegrees = aDegrees.concat(g_aDegrees);

	// Rotate the scale degrees the number of times specified by the offset for
	// the selected mode. For example, starting with Lydian [1, 5, 2, 6, 3, 7, 4]
	// and rotating three times to get to Dorian, we get [3, 7, 4, 1, 5, 2, 6].
	for(var i = 0; i > nModeOffset; --i)
	{
		aDegrees.unshift(aDegrees.pop());
	}

	// Figure out where on the circle the "active" notes begin and end. The
	// end position is always six steps clockwise of the start position. Of
	// course, both numbers can be invalid 12-hour clock positions, for example
	// 13 and 19 (they can even be negative). But we will use GetClockPos
	// to normalize them to 1 through 12.
	var nStartPos = oTonicInfo.m_nPos + nModeOffset;
	var nEndPos = nStartPos + 6;

	// For each clock position in the active range 
	// (also keep track of the ordinal position within this range, 0 - 6)	
	for(var nPos = nStartPos, nOrd = 0; nPos <= nEndPos; ++nPos, ++nOrd)
	{
		// Normalize the position to 1 through 12.
		var nClockPos = GetClockPos(nPos);
		
		// Hide the gray background for this position.
		var oGrayImg = document.getElementById("Gray_" + nClockPos);
		oGrayImg.style.visibility = "hidden";

		// Display the degree name for this position.
		var oDegree = document.getElementById("Degree_" + nClockPos);
		oDegree.style.visibility = "";
		
		// Set the degree name according to the array of degrees that we calculated
		// above, and the ordinal position within the scale.
		oDegree.innerHTML = MakeDegreeSymbol(aDegrees[nOrd], nOrd);
	}

	// Display the modes/degrees ring corresponding to the first active note position
	// on the circle.	
	document.getElementById("ModesDegrees_" + GetClockPos(nStartPos)).style.visibility = "";

	// Display the tonic arrow corresponding to the position of the tonic on the circle.
	document.getElementById("TonicArrow_" + oTonicInfo.m_nPos).style.visibility = "";

	// Support Internet Explorer pre-version-7 with respect to transparent PNG images.	
	FixTransparentPNGs();
}

function GetClockPos(
	nPos)
{
	// Given a clock position potentially outside the normalized range of 1 through 12,
	// normalize it to 1 through 12. For example, 18 becomes 6 and -3 becomes 9...

	var nClockPos = nPos;

	while(nClockPos < 1)
		nClockPos += 12;
		
	while(nClockPos > 12)
		nClockPos -= 12;
		
	return nClockPos;
}

function InsertAccidentalImages(
	sNoteName,
	nFontSize)
{
	// We only support the accidental appearing at the end of sNoteName, for example
	// "F#". If we find an accidental, replace it with the corresponding image in the
	// specified point size...
	
	if(sNoteName.match(/##$/))
		return sNoteName.replace(/##$/g, "<img class='DoubleSharp_" + nFontSize + "px' src='Images/DoubleSharpSymbol_" + nFontSize + "px.png'/>");
		
	if(sNoteName.match(/bb$/))
		return sNoteName.replace(/bb$/g, "<img class='DoubleFlat_" + nFontSize + "px' src='Images/DoubleFlatSymbol_" + nFontSize + "px.png'/>");
		
	if(sNoteName.match(/#$/))
		return sNoteName.replace(/#$/g, "<img class='Sharp_" + nFontSize + "px' src='Images/SharpSymbol_" + nFontSize + "px.png'/>");
		
	if(sNoteName.match(/b$/))
		return sNoteName.replace(/b$/g, "<img class='Flat_" + nFontSize + "px' src='Images/FlatSymbol_" + nFontSize + "px.png'/>");
		
	return sNoteName;
}

function FixTransparentPNGs()
{
	// This do-nothing version of this function is overridden for Internet Explorer versions
	// before version 7.
}

function MakeDegreeSymbol(
	nDegree, 
	nOrdinal)
{
	// Start with the basic seven roman numerals.
	var aRoman = [ "i", "ii", "iii", "iv", "v", "vi", "vii" ];

	// The first three circle positions are major chords, the next three are
	// minor, and the last position is diminished. This corresponds to the 
	// major/minor/diminished ring around the outside of the circle.	
	var bIsMajor = (nOrdinal >= 0) && (nOrdinal <= 2);
	var bIsDiminished = (nOrdinal == 6);

	// Grab the appropriate roman numeral from the array by scale degree.
	var sRoman = aRoman[nDegree - 1];

	// If it's a major chord, it's upper-case. If it's diminished, it has the degree
	// symbol after it. If it's minor, it's just plain lower-case.
	if(bIsMajor)
		return sRoman.toUpperCase();
	else if(bIsDiminished)
		return sRoman + "°";
	else
		return sRoman;
}

function ShowSelectedCell(
	oTable,
	sValue)
{
	// Ensure that only the cell in the table with the specified value is
	// indicated as selected, by CSS class.
	for(var nRow = 0; nRow < oTable.rows.length; ++nRow)
	{
		var oCell = oTable.rows[nRow].cells[0];
		var sCellValue = oCell.getAttribute("rds_value");
		
		if(sCellValue == sValue)
			AddElementClass(oCell, "selected");
		else
			RemoveElementClass(oCell, "selected");
	}
}

function FindParentByTag(
	oElem,
	sParentTagName)
{
	// Starting with the specified element, look up the parent chain for an element
	// with the specified tag name.
	while((oElem != null) && (oElem.tagName != null))
	{
		if(oElem.tagName.toLowerCase() == sParentTagName.toLowerCase())
			return oElem;
			
		oElem = oElem.parentNode;
	}
	
	// Didn't find one.
	return null;
}

function GetEventSrcElem(
	oEvent)
{
	// Cross-browser support.
	var oSrcElem = oEvent.srcElement ? oEvent.srcElement : oEvent.target;

	// Some browsers (e.g. Safari 1.3) give you the text INSIDE the A tag as the
	// event source, rather than the tag. In that case, just move up to the parent.
	if((oSrcElem != null) && (oSrcElem.nodeType == 3 /* Text */))
		oSrcElem = oSrcElem.parentNode;
		
	return oSrcElem;
}

function GetMouseOutEventToElem(
	oEvent)
{
	// Cross-browser support.
	var oToElem = oEvent.toElement ? oEvent.toElement : oEvent.relatedTarget;

	if(oToElem != null)
	{
		// Some browsers (e.g. Safari 1.3) give you the text INSIDE the A tag as the
		// event source, rather than the tag. In that case, just move up to the parent.
		// On Firefox, getting nodeType on some elements in the context of the mouseout
		// event causes an exception, which we suppress here.
		try
		{
			if(oToElem.nodeType == 3 /* Text */)
				oToElem = oToElem.parentNode;
		}
		catch(oErr) {}
	}

	return oToElem;
}

function ElementHasClass(
	oElem,
	sClass)
{
	// Return true if the specified element's className contains the specified
	// CSS class, either by itself or space-delimited.
	var bHasClass = 
			(oElem.className != null)
		&& (oElem.className.match("(^| )" + sClass + "($| )") != null);
		
	return bHasClass;
}

function AddElementClass(
	oElem,
	sClass)
{
	// If the element doesn't already have the specified CSS class, add it.
	if(!ElementHasClass(oElem, sClass))
		oElem.className += " " + sClass;
}

function RemoveElementClass(
	oElem,
	sClass)
{
	// If the element has the specified CSS class, remove it.
	if(ElementHasClass(oElem, sClass))
		oElem.className = oElem.className.replace(new RegExp("(^| )" + sClass + "($| )", "g"), "");
}
