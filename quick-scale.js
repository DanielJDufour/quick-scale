export function _identity(n) {
  return n;
}

export function _scale_number(old_min, old_range, new_min, new_range, n) {
  return new_min + (new_range * (n - old_min)) / old_range;
}

export function _scale_and_flip_number(old_min, old_range, new_max, new_range, n) {
  return new_max - (new_range * (n - old_min)) / old_range;
}

export function _scale_and_round_number(old_min, old_range, new_min, new_range, n) {
  return Math.round(new_min + (new_range * (n - old_min)) / old_range);
}

export function _scale_and_flip_and_round_number(old_min, old_range, new_max, new_range, n) {
  return Math.round(new_max - (new_range * (n - old_min)) / old_range);
}

// assuming not no data
export function createScaleFunction([old_min, old_max], [new_min, new_max], { flip, no_range_value, no_range_value_strategy = "highest", round = false } = {}) {
  const old_range = old_max - old_min;
  const new_range = new_max - new_min;

  if (old_range === 0) {
    if (typeof no_range_value === "number") {
      return _identity.bind(null, no_range_value);
    } else if (no_range_value_strategy === "highest") {
      return _identity.bind(null, new_max);
    } else if (no_range_value_strategy === "lowest") {
      return _identity.bind(null, new_min);
    } else if (no_range_value_strategy === "middle") {
      let n = (new_max - new_min) / 2;
      if (round) n = Math.round(n);
      return _identity.bind(null, n);
    }
  }

  if (flip) {
    if (round) {
      return _scale_and_flip_and_round_number.bind(null, old_min, old_range, new_max, new_range);
    } else {
      return _scale_and_flip_number.bind(null, old_min, old_range, new_max, new_range);
    }
  } else {
    if (round) {
      return _scale_and_round_number.bind(null, old_min, old_range, new_min, new_range);
    } else {
      return _scale_number.bind(null, old_min, old_range, new_min, new_range);
    }
  }
}

export function _scale(pixel, ...rest) {
  return create(rest)(pixel);
}
