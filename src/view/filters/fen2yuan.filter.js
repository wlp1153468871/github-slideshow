import floor from './floor.filter';

export default function fen2yuan(fen) {
  return floor(parseFloat(fen) / 100, 2);
}
