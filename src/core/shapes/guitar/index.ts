import type { ChordQuality, GuitarShapeDefinition } from "@/core/types";
import { GUITAR_OPEN_SHAPES } from "./open";
import { GUITAR_BARRE_E_SHAPES } from "./barre-e";
import { GUITAR_BARRE_A_SHAPES } from "./barre-a";

export const GUITAR_SHAPES: GuitarShapeDefinition[] = [
  ...GUITAR_OPEN_SHAPES,
  ...GUITAR_BARRE_E_SHAPES,
  ...GUITAR_BARRE_A_SHAPES,
];

export function getGuitarShapesByQuality(
  quality: ChordQuality
): GuitarShapeDefinition[] {
  return GUITAR_SHAPES.filter((shape) => shape.quality === quality);
}

export function getMovableGuitarShapesByQuality(
  quality: ChordQuality
): GuitarShapeDefinition[] {
  return GUITAR_SHAPES.filter(
    (shape) => shape.quality === quality && shape.movable
  );
}

export function getOpenGuitarShapesByQuality(
  quality: ChordQuality
): GuitarShapeDefinition[] {
  return GUITAR_SHAPES.filter(
    (shape) => shape.quality === quality && shape.type === "open"
  );
}