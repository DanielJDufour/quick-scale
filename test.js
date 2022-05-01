const test = require("flug");
const { _identity, _scale, _scale_number, _scale_and_flip_number, _scale_and_flip_and_round_number, _scale_and_round_number, createScaleFunction } = require("./quick-scale.js");

const OLD_MIN_MAX = [900, 12633];
const [OLD_MIN, OLD_MAX] = OLD_MIN_MAX;
const OLD_RANGE = OLD_MAX - OLD_MIN;
const NEW_MIN_MAX = [0, 255];
const [NEW_MIN, NEW_MAX] = NEW_MIN_MAX;
const NEW_RANGE = NEW_MAX - NEW_MIN;
const SAMPLE_VALUE = 1378;

test("_identity", ({ eq }) => {
  eq(_identity(2379123), 2379123);
  eq(_identity.bind({}, 255)(100), 255);
  eq(_identity.bind({}, 0)(100), 0);
  eq(_identity.bind({}, 150)(100), 150);
});

test("_scale_number", ({ eq }) => {
  eq(_scale_number(OLD_MIN, OLD_RANGE, NEW_MIN, NEW_RANGE, SAMPLE_VALUE).toFixed(4), "10.3886");
});

test("_scale_and_round_number", ({ eq }) => {
  eq(_scale_and_round_number(OLD_MIN, OLD_RANGE, NEW_MIN, NEW_RANGE, SAMPLE_VALUE), 10);
});

test("_scale_and_flip_number", ({ eq }) => {
  eq(_scale_and_flip_number(OLD_MIN, OLD_RANGE, NEW_MAX, NEW_RANGE, SAMPLE_VALUE).toFixed(4), "244.6114");
});

test("_scale_and_flip_and_round_number", ({ eq }) => {
  eq(_scale_and_flip_and_round_number(OLD_MIN, OLD_RANGE, NEW_MAX, NEW_RANGE, SAMPLE_VALUE), 245);
});

test("createScaleFunction", ({ eq }) => {
  eq(createScaleFunction(OLD_MIN_MAX, NEW_MIN_MAX)(SAMPLE_VALUE).toFixed(4), "10.3886");
  eq(createScaleFunction(OLD_MIN_MAX, NEW_MIN_MAX, { round: true })(SAMPLE_VALUE), 10);
});

test("no range", ({ eq }) => {
  eq(createScaleFunction([131072, 131072], NEW_MIN_MAX)(131072), 255);
  eq(createScaleFunction([131072, 131072], NEW_MIN_MAX, { no_range_value: -99 })(131072), -99);
  eq(
    createScaleFunction([131072, 131072], NEW_MIN_MAX, {
      no_range_value_strategy: "middle"
    })(131072),
    127.5
  );
  eq(
    createScaleFunction([131072, 131072], NEW_MIN_MAX, {
      no_range_value_strategy: "middle",
      round: true
    })(131072),
    128
  );
  eq(
    createScaleFunction([131072, 131072], NEW_MIN_MAX, {
      no_range_value_strategy: "lowest",
      round: true
    })(131072),
    0
  );
  eq(
    createScaleFunction([131072, 131072], NEW_MIN_MAX, {
      no_range_value_strategy: "highest",
      round: true
    })(131072),
    255
  );
});

test("example: basic usage", ({ eq }) => {
  const scale = createScaleFunction([0, Math.pow(2, 16) - 1], [0, Math.pow(2, 8) - 1]);
  eq(scale(65535), 255);
  eq(scale(0), 0);
  eq(scale(32767), 127.49805447470817);
});

test("example: advanced usage", ({ eq }) => {
  const old_range = [0, Math.pow(2, 16) - 1];
  const new_range = [0, Math.pow(2, 8) - 1];
  const options = {
    flip: true,
    no_range_value: -99,
    no_range_value_strategy: "lowest",
    round: true
  };
  const scale = createScaleFunction(old_range, new_range, options);
  eq(scale(65535), 0);
  eq(scale(0), 255);
  eq(scale(32767), 128);
});
