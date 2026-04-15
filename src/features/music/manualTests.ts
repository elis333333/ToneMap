import { parseMusicQuery } from "./parser";
import { detectChord, detectInterval } from "./detector";
import { buildChordNotes, buildChordSymbol } from "./chords";

function section(title: string) {
  console.log("\n" + "=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}

function test(label: string, value: unknown) {
  console.log(`\n${label}`);
  console.dir(value, { depth: null });
}
section("1) PARSER TESTS");

test('parseMusicQuery("C")', parseMusicQuery("C"));
test('parseMusicQuery("Cm")', parseMusicQuery("Cm"));
test('parseMusicQuery("Cmaj7")', parseMusicQuery("Cmaj7"));
test('parseMusicQuery("C7")', parseMusicQuery("C7"));
test('parseMusicQuery("Csus2")', parseMusicQuery("Csus2"));
test('parseMusicQuery("Do menor")', parseMusicQuery("Do menor"));
test('parseMusicQuery("Re mayor")', parseMusicQuery("Re mayor"));
test('parseMusicQuery("Fa#")', parseMusicQuery("Fa#"));
test('parseMusicQuery("Sib")', parseMusicQuery("Sib"));
test('parseMusicQuery("Lab")', parseMusicQuery("Lab"));
test('parseMusicQuery("Do# menor")', parseMusicQuery("Do# menor"));
test('parseMusicQuery("Sib maj7")', parseMusicQuery("Sib maj7"));
test('parseMusicQuery("Solb sus2")', parseMusicQuery("Solb sus2"));
test('parseMusicQuery("Sol sus4")', parseMusicQuery("Sol sus4"));
test('parseMusicQuery("cosa rara")', parseMusicQuery("cosa rara"));

section("2) BUILD CHORD TESTS");

test('buildChordSymbol("C", "major")', buildChordSymbol("C", "major"));
test('buildChordSymbol("C", "minor")', buildChordSymbol("C", "minor"));
test('buildChordSymbol("D", "maj7")', buildChordSymbol("D", "maj7"));
test('buildChordNotes("C", "major")', buildChordNotes("C", "major"));
test('buildChordNotes("C", "minor")', buildChordNotes("C", "minor"));
test('buildChordNotes("D", "maj7")', buildChordNotes("D", "maj7"));
test('buildChordNotes("E", "dominant7")', buildChordNotes("E", "dominant7"));

section("3) CHORD DETECTION TESTS");

test('detectChord(["C", "E", "G"])', detectChord(["C", "E", "G"]));
test('detectChord(["C", "Eb", "G"])', detectChord(["C", "Eb", "G"]));
test('detectChord(["C", "E", "G", "Bb"])', detectChord(["C", "E", "G", "Bb"]));
test('detectChord(["D", "F#", "A"])', detectChord(["D", "F#", "A"]));
test('detectChord(["B", "D", "F"])', detectChord(["B", "D", "F"]));
test('detectChord(["C", "D", "G"])', detectChord(["C", "D", "G"]));
test('detectChord(["C", "F", "G"])', detectChord(["C", "F", "G"]));

section("4) DETECTION WITH REPEATED NOTES");

test('detectChord(["C", "E", "G", "C"])', detectChord(["C", "E", "G", "C"]));
test('detectChord(["C", "Eb", "G", "C", "Eb"])', detectChord(["C", "Eb", "G", "C", "Eb"]));

section("5) INVERSION-LIKE INPUT TESTS");

test('detectChord(["E", "G", "C"])', detectChord(["E", "G", "C"]));
test('detectChord(["G", "C", "E"])', detectChord(["G", "C", "E"]));
test('detectChord(["Bb", "C", "E", "G"])', detectChord(["Bb", "C", "E", "G"]));

section("6) INVALID / EDGE TESTS");

test('detectChord(["C", "E"])', detectChord(["C", "E"]));
test('detectChord(["X", "Y", "Z"])', detectChord(["X", "Y", "Z"]));
test('detectChord(["C", "C#", "D"])', detectChord(["C", "C#", "D"]));

section("7) INTERVAL TESTS");

test('detectInterval(["C", "E"])', detectInterval(["C", "E"]));
test('detectInterval(["C", "Eb"])', detectInterval(["C", "Eb"]));
test('detectInterval(["G", "D"])', detectInterval(["G", "D"]));
test('detectInterval(["B", "F"])', detectInterval(["B", "F"]));
test('detectInterval(["C"])', detectInterval(["C"]));