import numeral from 'numeral'

function zero(num) {
  let str = '';
  for (let i = 0; i < num; i += 1) {
    str += '0';
  }
  return str;
}

const fix = (value, num) => {
  num = num || 0;
  if (num === 0) {
    return numeral(value).format(`0,0`);
  }
  return numeral(value).format(`0,0.${zero(num || 0)}`);
}

const rmb = (value, num) => {
  return `¥ ${numeral(value).format(`0,0.${zero(num || 2)}`)}`;
};

const dollar = (value, num) => {
  return numeral(value).format(`$ 0,0.${zero(num || 2)}`);
};

export {
  dollar,
  rmb,
  fix
};
