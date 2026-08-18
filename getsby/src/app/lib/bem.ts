import bncPackage from "bnc";

type BncConstructor = typeof bncPackage;
type CommonJsBncModule = BncConstructor & { default?: BncConstructor };

const moduleValue = bncPackage as CommonJsBncModule;

export const bnc: BncConstructor = moduleValue.default ?? moduleValue;
