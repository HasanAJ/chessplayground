import type { PracticePosition } from "../../domain/practice/positions.ts";

// Reached through legal play from varied openings. Reviewed with Stockfish 19
// (MultiPV 5, at least 2.5 seconds per position); exact equality is not required.
export const practicePositions: readonly PracticePosition[] = [
  {
    id: "accelerated-dragon-middle",
    phase: "middlegame",
    fen: "2rq1rk1/p2bppbp/3p1np1/1p6/2P1PPn1/1PN1B3/P1N1B1PP/2RQ1RK1 w - - 1 14",
  },
  {
    id: "benko-middle",
    phase: "middlegame",
    fen: "r4rk1/3npp1p/b2p2p1/q1pPb3/8/2N3PP/PPQ1PPB1/1RBR2K1 w - - 2 16",
  },
  {
    id: "benoni-middle",
    phase: "middlegame",
    fen: "r1b1r1k1/p2n4/1p1q2pQ/2pP1p2/P7/5N1P/1P2BPP1/R3K2R w KQ - 0 20",
  },
  {
    id: "bird-late-middle",
    phase: "middlegame",
    fen: "1r1r2k1/1q3pbp/4p1p1/3pP1P1/p2B1P2/P5P1/1P4K1/1QRR4 b - - 0 32",
  },
  {
    id: "bird-middle",
    phase: "middlegame",
    fen: "r3r1k1/pp1qppbp/2n2np1/3pP3/5P1N/N1PQ2P1/PP4bP/R1B2RK1 w - - 0 15",
  },
  {
    id: "botvinnik-english-middle",
    phase: "middlegame",
    fen: "1rbqnrk1/1p3pbp/p1np2p1/2p5/2P1PB2/1PNP2PP/P2QN1B1/2R2RK1 w - - 3 17",
  },
  {
    id: "budapest-middle",
    phase: "middlegame",
    fen: "r1b2rk1/1pp1qppp/3p4/p1b5/1PP2B2/P1Q1PB2/5PPP/R4RK1 b - - 0 15",
  },
  {
    id: "carlsbad-middle",
    phase: "middlegame",
    fen: "r1bqr1k1/1p2bpnp/2p2np1/p2p4/3P3B/P1NBP1N1/1P3PPP/2Q1RRK1 b - - 3 15",
  },
  {
    id: "caro-kann-middle",
    phase: "middlegame",
    fen: "2kr1b1r/1pq2pp1/p1p1pn2/7p/2PP3P/5Q2/PP1BNPP1/2KRR3 w - - 2 17",
  },
  {
    id: "catalan-middle",
    phase: "middlegame",
    fen: "r1br2k1/pp3pp1/2n1p2p/7q/2Q2B2/bP3NP1/4PPBP/3R1RK1 b - - 1 19",
  },
  {
    id: "chebanenko-middle",
    phase: "middlegame",
    fen: "r2q1rk1/5ppp/pnpb1n2/1P2p3/3P4/2NQP2P/PB1N1PP1/R4RK1 b - - 0 16",
  },
  {
    id: "chigorin-middle",
    phase: "middlegame",
    fen: "2rq1rk1/p2n1ppp/2Q5/2B1p3/4P1b1/2P5/P2N1PPP/R3KB1R w KQ - 1 16",
  },
  {
    id: "closed-sicilian-middle",
    phase: "middlegame",
    fen: "1r1q1rk1/pb3pbp/1pnpp1p1/2p5/P3PP2/3P2P1/1PPQ1BBP/R2N1RK1 b - - 2 15",
  },
  {
    id: "dutch-middle",
    phase: "middlegame",
    fen: "r1b3k1/1pq3bp/p1p1p1p1/3pP3/PPP1P3/6P1/1B2P1BP/2R2QK1 b - - 0 17",
  },
  {
    id: "english-late-middle",
    phase: "middlegame",
    fen: "4qrk1/1p3pp1/1b5p/1b1BP3/p2p3P/P2P2P1/4Q2K/2B2R2 b - - 0 23",
  },
  {
    id: "english-middle",
    phase: "middlegame",
    fen: "2bq1rk1/1pp2ppp/1b1p4/rP1P4/p2pP3/P5P1/3PQPBP/R1B2RK1 w - - 2 15",
  },
  {
    id: "four-knights-middle",
    phase: "middlegame",
    fen: "r3rbk1/1bp2ppp/1p2q3/p1p1p2n/P3P3/2NPBN1P/1PPQ1PP1/4RRK1 w - - 0 19",
  },
  {
    id: "french-middle",
    phase: "middlegame",
    fen: "rn3rk1/1bq1bppp/p3p3/1p1pP3/1P3P2/P1NQ4/2P1B1PP/R4RBK b - - 4 16",
  },
  {
    id: "grunfeld-middle",
    phase: "middlegame",
    fen: "2r2rk1/pp1q1pbp/6p1/3Pp3/2BnPP1P/4B3/P4P2/2RQ1K1R b - - 0 19",
  },
  {
    id: "hedgehog-middle",
    phase: "middlegame",
    fen: "rqr3k1/4bppp/p2ppn2/1p6/2P5/1P1Q2P1/PB2PPKP/R2RN3 w - - 0 17",
  },
  {
    id: "italian-middle",
    phase: "middlegame",
    fen: "r2qr1k1/ppp2pp1/2n1bn1p/3pp3/4P3/1BPPPN1P/PP2Q1P1/2KR1N1R w - - 6 15",
  },
  {
    id: "kalashnikov-late-middle",
    phase: "middlegame",
    fen: "1r1q1rk1/6p1/2Pp4/pB2pp2/P3Pn1p/Q3N3/1P3PPP/2R3K1 b - - 0 28",
  },
  {
    id: "kings-indian-attack-middle",
    phase: "middlegame",
    fen: "r2q1r2/pb3pbk/1p2p1pp/2p1Pn2/1n1p1B1P/3P1NP1/PPPQRPBN/R5K1 w - - 4 16",
  },
  {
    id: "kings-indian-middle",
    phase: "middlegame",
    fen: "3qnrk1/pr1bp1bp/1p3pp1/2pPp3/2P1P3/P1N4P/1P1B1PP1/1R1QRBK1 w - - 1 19",
  },
  {
    id: "kings-indian-saemisch-late-middle",
    phase: "middlegame",
    fen: "4r2k/7p/6p1/3q1p2/1p1b1B2/3bB1P1/PP1Q3P/2R3K1 b - - 1 29",
  },
  {
    id: "kings-indian-saemisch-middle",
    phase: "middlegame",
    fen: "1r1q1rk1/2pb2bp/2np1pp1/3N1p2/1p1PPB2/5P2/PP1Q2PP/2R1KB1R b K - 1 16",
  },
  {
    id: "london-middle",
    phase: "middlegame",
    fen: "1r3rk1/2q1bppp/2b1p3/pp2P3/2p1pB2/2P4P/PPB1QPP1/3RR1K1 b - - 1 20",
  },
  {
    id: "modern-late-middle",
    phase: "middlegame",
    fen: "7r/1br1ppk1/pq1p1np1/6Np/4P2P/2RQ1P2/PP4P1/1K1N1R2 b - - 0 24",
  },
  {
    id: "modern-middle",
    phase: "middlegame",
    fen: "r2qk2r/1b1npp2/p2p1np1/1p4Np/3QP2P/2N2PP1/PPP5/2KR1B1R w kq - 1 15",
  },
  {
    id: "nimzo-indian-middle",
    phase: "middlegame",
    fen: "r4rk1/pp3pp1/5n1p/q4b2/8/P3B2P/1PB2PP1/2RQ1RK1 w - - 1 20",
  },
  {
    id: "nimzo-saemisch-middle",
    phase: "middlegame",
    fen: "r4rk1/pp1bqp1p/3p4/n1pPp1pn/P1P1P3/2PB1P2/R3N1PP/2BQ1RK1 w - - 0 15",
  },
  {
    id: "panov-middle",
    phase: "middlegame",
    fen: "r1bq1rk1/pp3ppp/8/1N1np3/3b4/3B4/PP1BQPPP/2RR2K1 b - - 1 15",
  },
  {
    id: "petroff-middle",
    phase: "middlegame",
    fen: "r4rk1/ppp1bppp/2n5/3q1b2/3Pn3/3B1N2/PP3PPP/RNBQR1K1 w - - 0 11",
  },
  {
    id: "pianissimo-middle",
    phase: "middlegame",
    fen: "1r3rk1/2pq1pp1/R1np1n1p/1p2p3/4P3/1QPPbN1P/1P3PP1/4RNK1 w - - 0 17",
  },
  {
    id: "pirc-middle",
    phase: "middlegame",
    fen: "r1b1r1k1/1pp2p2/p1n4p/P1bPp1p1/2B5/5N1P/1PPB1PP1/2KR1R2 b - - 0 17",
  },
  {
    id: "queens-gambit-accepted-middle",
    phase: "middlegame",
    fen: "r1b1rbk1/5ppp/p1q2n2/4p1B1/1p2P3/5N1P/PP2QPP1/RN2R1K1 w - - 2 18",
  },
  {
    id: "queens-gambit-middle",
    phase: "middlegame",
    fen: "2r1k2r/1p2qpp1/1np2b1p/2Rp4/1P1P2b1/1Q1BP3/3NNPPP/4K2R b Kk - 6 17",
  },
  {
    id: "queens-indian-middle",
    phase: "middlegame",
    fen: "1rbqnrk1/2n1bpp1/pp1p3p/2pPp3/2P1P3/PPN2NPP/1R3PB1/2BQR1K1 b - - 0 20",
  },
  {
    id: "queens-indian-petrosian-middle",
    phase: "middlegame",
    fen: "2rq1rk1/pbnn1ppp/4pb2/2p5/1P2P3/P2B1NN1/R4PPP/2BQ1RK1 b - - 1 16",
  },
  {
    id: "reti-late-middle",
    phase: "middlegame",
    fen: "1r2rbk1/p4qp1/1p3n1p/1Pp5/P1QpP3/R5PP/1B3PB1/3R2K1 w - - 1 26",
  },
  {
    id: "reti-middle",
    phase: "middlegame",
    fen: "r1bqrbk1/pp3pp1/2n4p/2pnp3/8/PP1PP1PP/1BQN1PB1/RN1R2K1 b - - 0 15",
  },
  {
    id: "ruy-lopez-late-middle",
    phase: "middlegame",
    fen: "3r2k1/1pp2pp1/1n1b1q1p/p3p3/P1B1P2P/2P1N1P1/1P2QPK1/R7 w - - 0 31",
  },
  {
    id: "ruy-lopez-middle",
    phase: "middlegame",
    fen: "r1bqrbk1/1pp2pp1/2n4p/p3p2n/P3P3/2PBBN1P/1P2QPP1/RN2R1K1 b - - 1 15",
  },
  {
    id: "scandinavian-middle",
    phase: "middlegame",
    fen: "2kr3r/ppqn1ppb/3bp2p/6P1/3PBP2/5N2/PPPBQ2P/R3K2R w KQ - 4 17",
  },
  {
    id: "scheveningen-middle",
    phase: "middlegame",
    fen: "r4r1k/1bqnbppp/p1p1p3/3pP3/5PB1/1PN1B3/P1P3PP/3RQRK1 w - - 3 16",
  },
  {
    id: "scotch-gambit-middle",
    phase: "middlegame",
    fen: "r2qk2r/p1pb2pp/4n3/2ppPp2/3P1P2/5N2/PP4PP/R1BQ1RK1 b kq - 1 15",
  },
  {
    id: "scotch-middle",
    phase: "middlegame",
    fen: "r3k2r/ppp1np2/2n1b1p1/8/7q/2B1PBN1/PPP3PP/R2Q1RK1 b kq - 5 16",
  },
  {
    id: "semi-slav-quiet-middle",
    phase: "middlegame",
    fen: "r1b1r1k1/pp1n1pp1/2pq1n1p/b7/P1PP4/2NB2P1/1BQN1P1P/R3R1K1 w - - 1 17",
  },
  {
    id: "sicilian-late-middle",
    phase: "middlegame",
    fen: "1r4k1/3b1pbp/p1p1pp2/3p4/4PPP1/1qP1NQ2/1P1R3P/1K5R w - - 2 23",
  },
  {
    id: "sicilian-middle",
    phase: "middlegame",
    fen: "1q2kb1r/3b1p1p/p1pppp2/8/1r2PP2/4NQ2/PPP1B1PP/2KR3R w k - 5 16",
  },
  {
    id: "slav-middle",
    phase: "middlegame",
    fen: "3rk2r/Np2bp1p/2p1qn2/P3ppB1/1n6/6PP/1P2PPB1/R1Q2RK1 b k - 0 18",
  },
  {
    id: "stonewall-middle",
    phase: "middlegame",
    fen: "r4rk1/1p1bq1pp/n1pbpn2/p2pNp2/2PP4/PP2P1P1/1BQ1NPBP/R4RK1 b - - 0 14",
  },
  {
    id: "sveshnikov-middle",
    phase: "middlegame",
    fen: "1rbq1rk1/4np1p/3p1p2/1p2p3/1N2P3/2P5/1P3PPP/R2QKB1R b KQ - 1 16",
  },
  {
    id: "tarrasch-late-middle",
    phase: "middlegame",
    fen: "2r1r1k1/pp3p1p/2n5/3p4/4q1p1/P1Q1P1P1/1P3P1P/2RR1KN1 w - - 3 23",
  },
  {
    id: "tarrasch-middle",
    phase: "middlegame",
    fen: "r4rk1/pp2bpp1/4bn1p/q2p4/5B2/2NQ2P1/PP2PPBP/2R2RK1 b - - 3 14",
  },
  {
    id: "trompowsky-middle",
    phase: "middlegame",
    fen: "1r1qk2r/p4ppp/2n1pn2/1p1p4/2pP4/QPP1PP2/P2NB1PP/R4RK1 w k - 1 17",
  },
  {
    id: "two-knights-middle",
    phase: "middlegame",
    fen: "3r1rk1/p1q2pp1/2pb1n1p/n4b2/8/3N1B1P/PPPN1PP1/R1BQ1RK1 b - - 2 16",
  },
  {
    id: "vienna-middle",
    phase: "middlegame",
    fen: "r2q1rk1/1pp2pp1/p1np1n1p/4p3/2BPP1b1/P1NQPN2/1PP3PP/R3K2R w KQ - 3 11",
  },
  {
    id: "winawer-late-middle",
    phase: "middlegame",
    fen: "2r2qk1/p5p1/1pr1p2p/n2pPp2/P2P1P1P/2PQ2P1/R5K1/2RN4 w - f6 0 31",
  },
  {
    id: "winawer-middle",
    phase: "middlegame",
    fen: "2rqk2r/p3npp1/2n1p2p/2ppP2P/8/P1PQ1N2/2PB1PP1/R4RK1 b k - 1 14",
  },
  {
    id: "alekhine-end",
    phase: "endgame",
    fen: "8/3r1p1k/1P2p1p1/4R3/8/7P/1r3PP1/5RK1 w - - 1 33",
  },
  {
    id: "benoni-later-end",
    phase: "endgame",
    fen: "3r2k1/p7/1p4p1/2n2p2/P1pN4/R2b3P/1P3PP1/3KR3 w - - 1 29",
  },
  {
    id: "berlin-end",
    phase: "endgame",
    fen: "6k1/5p2/1pbB1P2/p7/P4p2/7p/1PP4K/8 w - - 0 33",
  },
  {
    id: "bogo-indian-end",
    phase: "endgame",
    fen: "8/p1R2p2/4pk1p/6p1/1n2PP2/6P1/5K1P/r4B2 b - - 1 33",
  },
  {
    id: "botvinnik-english-end",
    phase: "endgame",
    fen: "4n2k/7p/2B5/p1B1bp2/1p6/3P2PP/P6K/8 b - - 1 36",
  },
  {
    id: "botvinnik-english-late-end",
    phase: "endgame",
    fen: "8/6kp/2Bb4/B4p2/1p6/3P1KnP/P7/8 w - - 3 41",
  },
  {
    id: "carlsbad-end",
    phase: "endgame",
    fen: "8/5pk1/7p/3p1R2/6PP/1p2P3/1P4K1/7r b - - 0 44",
  },
  {
    id: "carlsbad-late-end",
    phase: "endgame",
    fen: "8/5pk1/7p/2rp1p2/1p2qQP1/4PRKP/1P6/8 b - - 1 39",
  },
  {
    id: "caro-kann-end",
    phase: "endgame",
    fen: "3k4/1p1n4/p1pN2p1/7p/2P2p1P/8/PP2KP2/8 w - - 0 31",
  },
  {
    id: "caro-kann-late-end",
    phase: "endgame",
    fen: "8/3n1k2/ppp3p1/7p/1PP1NK1P/8/P4P2/8 b - - 0 34",
  },
  {
    id: "catalan-end",
    phase: "endgame",
    fen: "1r4k1/p3r1p1/1b2p2p/BP2p3/8/6P1/4PPBP/R5K1 w - - 1 31",
  },
  {
    id: "catalan-late-end",
    phase: "endgame",
    fen: "1r6/p1r1k3/2B1p3/1P2K3/5P1p/R7/4P2P/8 w - - 0 40",
  },
  {
    id: "chebanenko-end",
    phase: "endgame",
    fen: "6k1/6p1/4p3/8/2N2PP1/2n1P3/5K2/8 w - - 1 50",
  },
  {
    id: "chigorin-end",
    phase: "endgame",
    fen: "2R5/pp3p1p/3k4/P2PpP2/3rP3/8/7P/7K b - - 0 39",
  },
  {
    id: "closed-sicilian-end",
    phase: "endgame",
    fen: "6k1/5pb1/p6p/2p1pPP1/P1PpN3/3P2B1/5K1P/1r6 w - - 0 36",
  },
  {
    id: "evans-gambit-end",
    phase: "endgame",
    fen: "6k1/1p1b4/1R3B2/3r4/P5p1/8/5PP1/6K1 w - - 0 33",
  },
  {
    id: "french-late-end",
    phase: "endgame",
    fen: "r5k1/5p1p/4p1pb/3pP3/5P2/r2B2P1/1RP3KP/3R4 w - - 6 39",
  },
  {
    id: "french-later-end",
    phase: "endgame",
    fen: "4rbk1/5p1p/4p1p1/3pP3/5PB1/2r3P1/1RP4P/3R3K w - - 0 36",
  },
  {
    id: "french-tarrasch-end",
    phase: "endgame",
    fen: "8/5p2/pp4p1/4k2p/PPK1P3/6P1/7P/8 w - - 0 45",
  },
  {
    id: "french-tarrasch-knight-end",
    phase: "endgame",
    fen: "5k2/5p2/pp4p1/3n3p/P7/1N2P1P1/1P2K2P/8 w - - 0 38",
  },
  {
    id: "grunfeld-end",
    phase: "endgame",
    fen: "6k1/p6p/5Q1P/3P2p1/2p1Pp2/5P2/P2q4/5K2 b - - 4 31",
  },
  {
    id: "hedgehog-end",
    phase: "endgame",
    fen: "5k2/6p1/4p2p/2b4P/p5K1/8/P4P2/2B5 w - - 0 40",
  },
  {
    id: "italian-end",
    phase: "endgame",
    fen: "4r3/pppn1kp1/5p2/4p3/2P5/2P4P/PP1K1R2/6R1 w - - 2 31",
  },
  {
    id: "italian-late-end",
    phase: "endgame",
    fen: "5nr1/ppp2kp1/5p2/4p3/2P4P/2P1K3/PP4R1/6R1 b - - 2 33",
  },
  {
    id: "kings-indian-attack-end",
    phase: "endgame",
    fen: "5k2/5p2/p3p1p1/4P1Pp/3n3P/3p4/PP3PN1/3K4 b - - 1 47",
  },
  {
    id: "kings-indian-attack-late-end",
    phase: "endgame",
    fen: "5k2/5p2/2n1p1p1/p3P1Pp/5P2/P2NK3/1P6/8 b - - 0 53",
  },
  {
    id: "kings-indian-saemisch-end",
    phase: "endgame",
    fen: "8/7p/5kp1/5p2/1p2b3/1P4P1/P2B3P/4K3 b - - 1 38",
  },
  {
    id: "modern-end",
    phase: "endgame",
    fen: "8/2r1pp1k/p3b1p1/4P2p/1P1pN2P/5P2/1P4P1/1K2R3 b - - 2 33",
  },
  {
    id: "nimzo-indian-end",
    phase: "endgame",
    fen: "6k1/2r2pp1/7p/p1p2b2/P7/1B3P1P/1P4P1/3R2K1 w - - 0 31",
  },
  {
    id: "nimzo-indian-late-end",
    phase: "endgame",
    fen: "8/1R4pk/7p/8/P4P2/1p5P/6PK/5r2 b - - 4 38",
  },
  {
    id: "panov-end",
    phase: "endgame",
    fen: "r2r1k2/p4p1p/B3b3/2R3p1/3p4/1P5P/P2R1PP1/5K2 b - - 3 30",
  },
  {
    id: "pawn-caro-kann-endgame",
    phase: "endgame",
    fen: "8/8/1p1k2p1/1Pp4p/4K2P/8/P4P2/8 w - - 0 41",
  },
  {
    id: "pawn-english-endgame",
    phase: "endgame",
    fen: "6k1/8/6p1/2P4p/7P/Pp4P1/6K1/8 w - - 0 65",
  },
  {
    id: "pawn-london-endgame",
    phase: "endgame",
    fen: "8/5k2/8/1p2p3/p1p5/P1P2Pp1/1P1K2P1/8 b - - 0 45",
  },
  {
    id: "pawn-queens-gambit-endgame",
    phase: "endgame",
    fen: "8/6p1/2p5/4P2p/2k4P/1p4P1/3K1P2/8 b - - 0 48",
  },
  {
    id: "pawn-reti-endgame",
    phase: "endgame",
    fen: "8/p5p1/1p4kp/1P6/P4KP1/8/5P2/8 b - - 0 47",
  },
  {
    id: "pawn-tarrasch-endgame",
    phase: "endgame",
    fen: "8/8/8/3k1p1p/6p1/4K1P1/5P1P/8 b - - 1 47",
  },
  {
    id: "petroff-end",
    phase: "endgame",
    fen: "1r4k1/2q2p1p/Q5b1/1B1p4/P7/7P/1P3RP1/6K1 b - - 4 31",
  },
  {
    id: "philidor-end",
    phase: "endgame",
    fen: "8/6p1/5p2/5P1k/8/5p1P/8/2N2K2 w - - 0 48",
  },
  {
    id: "pianissimo-late-end",
    phase: "endgame",
    fen: "8/n2k1pp1/3p3p/2pPp3/1p2PP2/3PK1PP/1P1N4/8 w - - 0 37",
  },
  {
    id: "pirc-end",
    phase: "endgame",
    fen: "3R4/1r1P4/3R3p/1p2p1pk/1n6/7b/1K3P2/8 b - - 0 42",
  },
  {
    id: "pirc-later-end",
    phase: "endgame",
    fen: "8/3R4/7p/1p4pk/3Kp3/3n4/5P2/8 b - - 3 46",
  },
  {
    id: "queens-gambit-accepted-end",
    phase: "endgame",
    fen: "2R2b2/3n1k1p/4rp2/4pp2/1p2P3/1N2B2P/P4PP1/6K1 b - - 0 34",
  },
  {
    id: "queens-gambit-accepted-later-end",
    phase: "endgame",
    fen: "4kb2/3n3p/5p2/4p3/rpR1Pp2/7P/P2B1PP1/2N3K1 b - - 7 38",
  },
  {
    id: "queens-indian-petrosian-end",
    phase: "endgame",
    fen: "6k1/5p1p/2b3p1/1n2p3/4P3/P5N1/3B1PPP/6K1 b - - 0 36",
  },
  {
    id: "queens-indian-petrosian-late-end",
    phase: "endgame",
    fen: "8/7p/2b5/4p3/4k3/4N3/5PPP/7K w - - 8 47",
  },
  {
    id: "ragozin-late-end",
    phase: "endgame",
    fen: "8/p4p2/2B3b1/4k2p/7P/P3K3/8/8 b - - 1 52",
  },
  {
    id: "reti-late-end",
    phase: "endgame",
    fen: "6k1/p4qp1/1p5p/1P6/P2pr3/Q5PP/5PK1/3R4 b - - 1 33",
  },
  {
    id: "rook-bird-endgame",
    phase: "endgame",
    fen: "5rk1/2R2p2/4P1p1/5p2/P2p3K/6P1/1P6/8 b - - 0 54",
  },
  {
    id: "rook-catalan-endgame",
    phase: "endgame",
    fen: "8/pr2k3/4p3/8/R3KP1p/4P3/7P/8 w - - 0 44",
  },
  {
    id: "rook-italian-endgame",
    phase: "endgame",
    fen: "4k2r/p1p3R1/1p3p2/4p3/2P1K2P/2P5/PP6/8 b - - 0 38",
  },
  {
    id: "rook-nimzo-indian-endgame",
    phase: "endgame",
    fen: "8/2r2ppk/7p/5R2/P7/1p3P1P/1P4P1/6K1 b - - 0 34",
  },
  {
    id: "rook-ruy-lopez-endgame",
    phase: "endgame",
    fen: "4rk2/5pp1/2p4p/p6P/P3P3/3R2P1/5PK1/8 w - - 0 50",
  },
  {
    id: "ruy-lopez-later-end",
    phase: "endgame",
    fen: "3r1k2/2p2pp1/1p5p/PQ2R2P/P2qP3/6P1/5PK1/8 w - - 0 45",
  },
  {
    id: "scandinavian-later-end",
    phase: "endgame",
    fen: "2k4r/2r2p2/4p3/3nP3/1p1P2p1/1K1R2B1/1PP4P/2R5 w - - 4 37",
  },
  {
    id: "scheveningen-end",
    phase: "endgame",
    fen: "8/6k1/8/p5pp/2B5/pP1K3P/2P5/8 w - - 0 47",
  },
  {
    id: "scotch-late-end",
    phase: "endgame",
    fen: "4k3/p1p2p2/2p1b1p1/8/8/2Q1P3/2PK1R2/7q w - - 4 34",
  },
  {
    id: "slav-later-end",
    phase: "endgame",
    fen: "4k2r/4np1p/p2r4/5pB1/4p3/6PP/1P2PPB1/2R3K1 w k - 0 25",
  },
  {
    id: "sveshnikov-end",
    phase: "endgame",
    fen: "2r5/6kp/5p2/3Npn2/3pR3/2P3P1/1P3P1P/5K2 w - - 4 33",
  },
  {
    id: "tarrasch-end",
    phase: "endgame",
    fen: "6k1/N4p1p/1p6/8/3P2p1/n5P1/4KP1P/8 b - - 1 34",
  },
  {
    id: "trompowsky-end",
    phase: "endgame",
    fen: "8/2k4p/5pp1/8/8/4KP1P/6P1/8 w - - 0 47",
  },
  {
    id: "trompowsky-late-end",
    phase: "endgame",
    fen: "5k2/5ppp/2P5/8/8/R4P2/5KPP/2r5 w - - 1 38",
  },
  {
    id: "two-knights-end",
    phase: "endgame",
    fen: "6k1/6p1/p4p2/2R5/8/r5P1/5P2/5K2 b - - 1 45",
  },
  {
    id: "two-knights-late-end",
    phase: "endgame",
    fen: "6k1/p4pp1/7p/8/1Br1n3/P5P1/5PK1/4R3 b - - 2 33",
  },
  {
    id: "winawer-end",
    phase: "endgame",
    fen: "2r4k/p7/1p2P3/4R1pP/P2r1p2/8/5RK1/8 b - - 0 46",
  },
];

// Source moves are only used by validation tests; they are omitted from the app bundle.
export const practiceSources: Record<string, string> = {
  "accelerated-dragon-middle":
    "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g7g6 c2c4 f8g7 c1e3 g8f6 b1c3 e8g8 f1e2 d7d6 e1g1 c8d7 d4c2 a8c8 a1c1 c6e5 b2b3 b7b5 f2f4 e5g4",
  "benko-middle":
    "d2d4 g8f6 c2c4 c7c5 d4d5 b7b5 c4b5 a7a6 b5a6 c8a6 b1c3 d7d6 g1f3 g7g6 g2g3 f8g7 f1g2 e8g8 e1g1 b8d7 d1c2 d8c7 f1d1 f6g4 h2h3 g4e5 f3e5 g7e5 a1b1 c7a5",
  "benoni-middle":
    "d2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3 e6d5 c4d5 d7d6 e2e4 g7g6 h2h3 b8d7 d1c2 d8e7 a2a4 h7h6 c1e3 f8g7 f1e2 e8g8 g1f3 f6h7 c2d2 h7f6 e2d3 f6e4 c3e4 f7f5 e4d6 e7d6 e3h6 f8e8 d3e2 g7h6 d2h6 b7b6",
  "bird-late-middle":
    "f2f4 d7d5 g1f3 g7g6 g2g3 f8g7 f1g2 g8f6 e1g1 e8g8 d2d3 c7c5 d1e1 b8c6 c2c3 f8e8 b1a3 c8f5 f3h4 d8d7 e2e4 f5h3 e1e2 c5c4 e4e5 c4d3 e2d3 h3g2 g1g2 f6e4 c1e3 a8d8 a1e1 e8f8 a3c2 b7b5 e1e2 e7e6 c2d4 b5b4 c3b4 c6b4 d3b1 d7b7 f1d1 a7a5 a2a3 b4c6 d4c6 b7c6 e2c2 c6b7 e3d4 a5a4 h4f3 d8a8 h2h4 a8b8 f3g5 f8d8 c2c1 e4g5 h4g5",
  "bird-middle":
    "f2f4 d7d5 g1f3 g7g6 g2g3 f8g7 f1g2 g8f6 e1g1 e8g8 d2d3 c7c5 d1e1 b8c6 c2c3 f8e8 b1a3 c8f5 f3h4 d8d7 e2e4 f5h3 e1e2 c5c4 e4e5 c4d3 e2d3 h3g2",
  "botvinnik-english-middle":
    "c2c4 g7g6 b1c3 f8g7 g2g3 e7e5 f1g2 d7d6 e2e4 b8c6 g1e2 g8f6 e1g1 e8g8 d2d3 a7a6 c1e3 a8b8 b2b3 f6g4 e3d2 c6e7 h2h3 g4f6 a1c1 c7c5 f2f4 e5f4 d2f4 e7c6 d1d2 f6e8",
  "budapest-middle":
    "d2d4 g8f6 c2c4 e7e5 d4e5 f6g4 c1f4 b8c6 g1f3 f8b4 b1d2 d8e7 e2e3 g4e5 f1e2 d7d6 e1g1 e8g8 d2b3 c6a5 a2a3 e5f3 e2f3 a5b3 d1b3 b4c5 b3c3 a7a5 b2b4",
  "carlsbad-middle":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c4d5 e6d5 c1g5 f8e7 e2e3 e8g8 f1d3 b8d7 d1c2 f8e8 g1e2 d7f8 e1g1 c7c6 a1e1 g7g6 g5h4 f8e6 a2a3 a7a5 c2c1 e6g7 e2g3",
  "caro-kann-middle":
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4 h7h6 f1d3 g6d3 d1d3 b8d7 c1d2 g8f6 g1e2 d8c7 g3e4 a7a6 e1c1 e7e6 c2c4 f6e4 d3e4 d7f6 e4f3 h6h5 h1e1 e8c8",
  "catalan-middle":
    "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2 f8e7 g1f3 e8g8 e1g1 c7c5 c4d5 f6d5 b1c3 b8c6 a1b1 d8a5 d4c5 a5c5 c1d2 f8d8 b1c1 h7h6 c3d5 c5d5 a2a3 e7f6 b2b3 d5f5 d1c2 f5h5 c2c4 f6b2 c1d1 b2a3 d2f4",
  "chebanenko-middle":
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 a7a6 e2e3 b7b5 b2b3 c8g4 f1e2 e7e6 e1g1 b8d7 c1b2 f8d6 h2h3 g4f5 e2d3 e8g8 d1c2 f5d3 c2d3 d5c4 b3c4 d7b6 f3d2 e6e5 c4b5",
  "chigorin-middle":
    "d2d4 d7d5 c2c4 b8c6 b1c3 g8f6 g1f3 c8g4 c4d5 f6d5 e2e4 d5c3 b2c3 e7e5 d4d5 c6b8 d1a4 b8d7 c1e3 f8d6 f3d2 e8g8 a4b5 c7c6 d5c6 b7c6 b5c6 d6c5 e3c5 a8c8",
  "closed-sicilian-middle":
    "e2e4 c7c5 b1c3 b8c6 g2g3 g7g6 f1g2 f8g7 d2d3 d7d6 f2f4 e7e6 g1f3 g8e7 e1g1 e8g8 c1e3 c6d4 d1d2 a8b8 a2a4 b7b6 c3d1 e7c6 e3f2 d4f3 g2f3 c8b7 f3g2",
  "dutch-middle":
    "d2d4 f7f5 g2g3 g8f6 f1g2 g7g6 g1f3 f8g7 e1g1 e8g8 c2c4 d7d6 b2b4 c7c6 c1b2 f6e4 b1c3 a7a6 a1c1 d6d5 f3e5 e7e6 c3e4 f5e4 f2f3 b8d7 a2a4 d8c7 f3e4 f8f1 d1f1 d7e5 d4e5",
  "english-late-middle":
    "c2c4 e7e5 b1c3 g8f6 g1f3 b8c6 g2g3 f8b4 f1g2 e8g8 c3d5 d7d6 e1g1 f6d5 c4d5 c6d4 f3d4 e5d4 a2a3 b4a5 b2b4 a5b6 e2e4 a7a5 b4b5 a5a4 d1e2 a8a5 a1b1 d8e8 h2h4 h7h6 g1h2 c8d7 d2d3 a5b5 b1b5 d7b5 f2f4 c7c6 e4e5 c6d5 g2d5 d6e5 f4e5",
  "english-middle":
    "c2c4 e7e5 b1c3 g8f6 g1f3 b8c6 g2g3 f8b4 f1g2 e8g8 c3d5 d7d6 e1g1 f6d5 c4d5 c6d4 f3d4 e5d4 a2a3 b4a5 b2b4 a5b6 e2e4 a7a5 b4b5 a5a4 d1e2 a8a5",
  "four-knights-middle":
    "e2e4 e7e5 g1f3 b8c6 b1c3 g8f6 f1b5 f8b4 e1g1 e8g8 b5c6 d7c6 a2a4 f8e8 c3a2 b4f8 d2d3 a7a5 c1g5 d8d6 a2c3 b7b6 g5e3 d6b4 a1a3 b4e7 a3a2 f6h5 a2a1 c8a6 d1d2 e7e6 h2h3 a6b7 a1e1 c6c5",
  "french-middle":
    "e2e4 e7e6 d2d4 d7d5 b1c3 g8f6 e4e5 f6d7 f2f4 c7c5 g1f3 b8c6 f1e2 a7a6 c1e3 f8e7 e1g1 d8c7 g1h1 c6d4 f3d4 c5d4 d1d4 b7b5 b2b4 d7b8 a2a3 c8b7 d4d3 e8g8 e3g1",
  "grunfeld-middle":
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3 b2c3 f8g7 g1f3 e8g8 a1b1 c8g4 h2h3 g4f3 g2f3 c7c5 f1c4 d8a5 c1d2 b8c6 e1f1 c5d4 c3d4 a5c7 d4d5 c6d4 b1c1 a8c8 h3h4 c7d7 d2e3 e7e5 f3f4",
  "hedgehog-middle":
    "c2c4 c7c5 g1f3 g8f6 b1c3 e7e6 g2g3 b7b6 f1g2 c8b7 e1g1 f8e7 d2d4 c5d4 d1d4 d7d6 f1d1 a7a6 b2b3 b8d7 c1b2 e8g8 f3e1 b7g2 g1g2 d8b8 c3e4 f8c8 e4f6 d7f6 d4d3 b6b5",
  "italian-middle":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d3 d7d6 h2h3 e8g8 c1g5 c5b6 c4b3 c8e6 b1d2 h7h6 g5e3 b6e3 f2e3 d6d5 d1e2 f6h5 d2f1 f8e8 e1c1 h5f6",
  "kalashnikov-late-middle":
    "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 e7e5 d4b5 d7d6 c2c4 f8e7 b1c3 a7a6 b5a3 c8e6 f1e2 e7g5 e1g1 g5c1 a1c1 g8f6 a3c2 d8c7 d1d2 a8c8 c3d5 e6d5 c4d5 c6e7 c2e3 c7d8 d2b4 c8b8 a2a4 h7h5 c1c3 h5h4 e2d3 e8g8 f1a1 a6a5 b4a3 b7b6 a1c1 f6h5 d3e2 h5f4 e2a6 b6b5 a6b5 f7f5 c3c6 e7c6 d5c6",
  "kings-indian-attack-middle":
    "e2e4 e7e6 d2d3 d7d5 b1d2 c7c5 g1f3 b8c6 g2g3 g7g6 f1g2 f8g7 e1g1 g8e7 f1e1 e8g8 e4e5 b7b6 h2h4 h7h6 d2f1 c8b7 f1h2 e7f5 c1f4 d5d4 d1d2 g8h7 e1e2 c6b4",
  "kings-indian-middle":
    "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 g1f3 e8g8 f1d3 b8a6 e1g1 c7c6 c1e3 c6c5 d4d5 b7b6 f1e1 f6g4 e3f4 a6c7 f4g5 f7f6 g5d2 a8b8 h2h3 g4e5 d3f1 b8b7 f3e5 d6e5 a1b1 c7e8 a2a3 c8d7",
  "kings-indian-saemisch-late-middle":
    "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 f2f3 e8g8 c1e3 b8c6 g1e2 a7a6 d1d2 a8b8 c3d5 b7b5 a1c1 c8d7 d5f6 e7f6 c4b5 a6b5 e2c3 b5b4 c3d5 f6f5 e3g5 f7f6 g5f4 f5e4 f3e4 g8h8 f1e2 f8e8 e2f3 f6f5 e4e5 d8h4 g2g3 c6d4 e1g1 d4f3 f1f3 h4g4 f3d3 d7b5 e5d6 b5d3 d6c7 g7d4 f4e3 g4e4 c7b8b e4d5 b8f4",
  "kings-indian-saemisch-middle":
    "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 f2f3 e8g8 c1e3 b8c6 g1e2 a7a6 d1d2 a8b8 c3d5 b7b5 a1c1 c8d7 d5f6 e7f6 c4b5 a6b5 e2c3 b5b4 c3d5 f6f5 e3g5 f7f6 g5f4",
  "london-middle":
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5 e2e3 b8c6 c2c3 e7e6 f1b5 c8d7 e1g1 f8e7 f1e1 e8g8 b5d3 d7e8 f3e5 f6e4 h2h3 c6e5 d4e5 e8c6 b1d2 a7a5 d1c2 e4d2 c2d2 b7b5 d2e2 d8c7 a1d1 a8b8 e3e4 c5c4 d3b1 d5e4 b1c2",
  "modern-late-middle":
    "e2e4 g7g6 d2d4 f8g7 b1c3 d7d6 c1e3 a7a6 d1d2 b7b5 f2f3 b8d7 h2h4 h7h5 g1h3 c8b7 e1c1 c7c5 h3g5 c5d4 e3d4 g7d4 d2d4 g8f6 c1b1 a8c8 d4d2 d8b6 f1e2 c8c7 d1c1 b6a5 d2e3 e8f8 h1f1 f8g7 c3d1 a5b6 e2d3 d7c5 e3e2 c5d3 e2d3 b5b4 c2c4 b4c3 c1c3",
  "modern-middle":
    "e2e4 g7g6 d2d4 f8g7 b1c3 d7d6 c1e3 a7a6 d1d2 b7b5 f2f3 b8d7 h2h4 h7h5 g1h3 c8b7 e1c1 c7c5 d4c5 d7c5 e3d4 g7f6 h3g5 c5d7 g2g3 f6d4 d2d4 g8f6",
  "nimzo-indian-middle":
    "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8 f1d3 d7d5 c1d2 h7h6 g1f3 c7c5 c4d5 e6d5 d3c2 b8c6 a2a3 b4a5 d4c5 d5d4 e3d4 c6d4 f3d4 d8d4 e1g1 a5c7 c3b5 d4c5 b5c7 c5c7 a1c1 c7b6 d2e3 b6a5 h2h3 c8f5",
  "nimzo-saemisch-middle":
    "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 a2a3 b4c3 b2c3 c7c5 e2e3 e8g8 f1d3 b8c6 g1e2 d7d6 e3e4 e6e5 d4d5 c6a5 e1g1 f6h5 a3a4 d8e7 a1a2 c8d7 f2f3 g7g5",
  "panov-middle":
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 c2c4 g8f6 b1c3 e7e6 g1f3 f8b4 c4d5 f6d5 c1d2 e8g8 f1d3 b8c6 e1g1 b4e7 a1c1 e7f6 d1e2 c6d4 f3d4 f6d4 f1d1 e6e5 c3b5",
  "petroff-middle":
    "e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3 f6e4 d2d4 d6d5 f1d3 c8f5 e1g1 f8e7 f1e1 e8g8 c2c4 b8c6 c4d5 d8d5",
  "pianissimo-middle":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 d2d3 g8f6 c2c3 d7d6 e1g1 e8g8 f1e1 a7a6 c4b3 c5a7 b1d2 h7h6 h2h3 c8e6 d2f1 e6b3 d1b3 b7b5 a2a4 a8b8 a4b5 a6b5 a1a6 d8d7 c1e3 a7e3",
  "pirc-middle":
    "e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 g1f3 f8g7 f1e2 e8g8 a2a4 e7e5 d4e5 d6e5 d1d8 f8d8 c1d2 h7h6 e1c1 d8e8 e2c4 g7f8 h1e1 a7a6 h2h3 g6g5 a4a5 f8c5 e1f1 b8c6 c3d5 f6d5 e4d5",
  "queens-gambit-accepted-middle":
    "d2d4 d7d5 c2c4 d5c4 g1f3 g8f6 e2e3 e7e6 f1c4 c7c5 d1e2 c5d4 f3d4 e6e5 d4f3 f8d6 c4b5 b8c6 e3e4 d8c7 e1g1 e8g8 h2h3 a7a6 b5c6 c7c6 f1e1 f8e8 b1c3 b7b5 c1g5 b5b4 c3b1 d6f8",
  "queens-gambit-middle":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1g5 f8e7 c4d5 e6d5 g1f3 c8e6 a1c1 h7h6 g5f6 e7f6 a2a3 b8d7 e2e3 a8c8 f1d3 c7c6 b2b4 a7a5 c3e2 a5b4 a3b4 d8e7 d1b3 d7b6 c1c5 e6g4 f3d2",
  "queens-indian-middle":
    "d2d4 g8f6 c2c4 e7e6 g1f3 b7b6 g2g3 c8b7 f1g2 f8e7 e1g1 c7c6 f3d2 b8a6 a2a3 e8g8 b1c3 a6c7 f1e1 a8b8 e2e4 f6e8 d2f3 d7d6 b2b3 c6c5 a1a2 a7a6 a2d2 d8c8 d4d5 e6e5 f3h4 c8d8 h4f3 h7h6 d2b2 b7c8 h2h3",
  "queens-indian-petrosian-middle":
    "d2d4 g8f6 c2c4 e7e6 g1f3 b7b6 a2a3 c8b7 b1c3 d7d5 c4d5 f6d5 e2e3 f8e7 f1b5 c7c6 b5d3 e8g8 e1g1 b8d7 c3e2 a8c8 e3e4 d5c7 b2b4 c6c5 d4c5 e7f6 a1a2 b6c5 e2g3",
  "reti-late-middle":
    "g1f3 d7d5 g2g3 g8f6 f1g2 e7e6 e1g1 f8e7 d2d3 e8g8 c2c4 c7c5 d1c2 b8c6 e2e3 h7h6 a2a3 f8e8 b2b3 e7f8 f1d1 d8c7 c1b2 e6e5 c4d5 f6d5 f3d2 c7d8 h2h3 a8b8 d2e4 c8e6 b1d2 b7b6 b3b4 f7f5 b4b5 c6d4 e3d4 e5d4 d2c4 f5e4 d3e4 d5f6 a3a4 d8c7 a1a3 e6c4 c2c4 c7f7",
  "reti-middle":
    "g1f3 d7d5 g2g3 g8f6 f1g2 e7e6 e1g1 f8e7 d2d3 e8g8 c2c4 c7c5 d1c2 b8c6 e2e3 h7h6 a2a3 f8e8 b2b3 e7f8 f1d1 d8c7 c1b2 e6e5 c4d5 f6d5 f3d2 c7d8 h2h3",
  "ruy-lopez-late-middle":
    "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 d7d6 c2c3 e8g8 h2h3 f8e8 a4c2 d6d5 d2d3 d5e4 d3e4 e7f8 a2a4 f6h5 d1e2 h7h6 c1e3 a6a5 c2d3 d8f6 d3b5 c8e6 e1d1 e8e7 d1e1 c6b8 f3g5 h5f4 e3f4 f6f4 g5e6 e7e6 g2g3 f4g5 b1d2 g5d8 g1g2 d8e7 e1d1 b8d7 d2f1 d7b6 f1e3 a8d8 h3h4 e7f6 b5c4 e6d6 d1d6 f8d6",
  "ruy-lopez-middle":
    "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 d7d6 c2c3 e8g8 h2h3 f8e8 a4c2 d6d5 d2d3 d5e4 d3e4 e7f8 a2a4 f6h5 d1e2 h7h6 c1e3 a6a5 c2d3",
  "scandinavian-middle":
    "e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 d2d4 g8f6 f1e2 c7c6 c1d2 h7h6 e2c4 c8g4 f2f3 g4f5 g2g4 f5h7 d1e2 a5c7 f3f4 b8d7 g4g5 f6d5 c3d5 c6d5 c4d5 e7e6 g1f3 e8c8 d5e4 f8d6",
  "scheveningen-middle":
    "e2e4 c7c5 g1f3 e7e6 d2d4 c5d4 f3d4 a7a6 b1c3 d8c7 f1e2 g8f6 e1g1 d7d6 f2f4 f8e7 c1e3 e8g8 d1e1 b8c6 d4c6 b7c6 a1d1 d6d5 e4e5 f6d7 b2b3 c8b7 e2g4 g8h8",
  "scotch-gambit-middle":
    "e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f1c4 g8f6 e4e5 d7d5 c4b5 f6e4 f3d4 c8d7 b5c6 b7c6 e1g1 f8c5 f2f3 e4g5 f3f4 g5e6 c2c3 c5d4 c3d4 f7f5 b1d2 c6c5 d2f3",
  "scotch-middle":
    "e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 f8c5 d4f5 d8f6 b1c3 g8e7 f1e2 d7d5 f5e3 c5e3 f2e3 d5e4 c3e4 f6g6 e4g3 h7h5 e2h5 g6g5 e1g1 g7g6 h5f3 g5h4 c1d2 c8e6 d2c3",
  "semi-slav-quiet-middle":
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 e7e6 e2e3 b8d7 d1c2 f8d6 b2b3 e8g8 c1b2 f8e8 f1d3 d5c4 b3c4 e6e5 e1g1 d8e7 f3d2 d6c7 f1e1 h7h6 a2a4 e5d4 e3d4 e7d6 g2g3 c7a5",
  "sicilian-late-middle":
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6 c1g5 c8d7 g5f6 g7f6 d1h5 d8c7 c3d5 c7d8 e1c1 b8c6 d4c6 b7c6 d5e3 e7e6 f2f4 a8b8 f1e2 b8b4 h5f3 d8b8 e2c4 f8g7 c4b3 e8g8 c2c3 b4b7 d1d2 d6d5 g2g4 b7b3 a2b3 b8b3 c1b1 f8b8",
  "sicilian-middle":
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6 c1g5 c8d7 g5f6 g7f6 d1h5 d8c7 c3d5 c7d8 e1c1 b8c6 d4c6 b7c6 d5e3 e7e6 f2f4 a8b8 f1e2 b8b4 h5f3 d8b8",
  "slav-middle":
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 d5c4 a2a4 c8f5 f3e5 d8c7 e5c4 g7g6 h2h3 b8a6 g2g3 a8d8 f1g2 a6b4 c4e3 e7e5 e3f5 g6f5 c1g5 f8e7 e1g1 d8d4 d1c1 c7c8 c3b5 d4d8 b5a7 c8e6 a4a5",
  "stonewall-middle":
    "d2d4 f7f5 g2g3 g8f6 f1g2 e7e6 g1f3 d7d5 e1g1 f8d6 c2c4 c7c6 b1c3 e8g8 b2b3 d8e7 c1b2 c8d7 e2e3 f6g4 c3e2 g4f6 f3e5 a7a5 d1c2 b8a6 a2a3",
  "sveshnikov-middle":
    "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e5 d4b5 d7d6 c1g5 a7a6 b5a3 b7b5 c3d5 f8e7 g5f6 e7f6 c2c3 e8g8 a3c2 a8b8 a2a4 c6e7 d5f6 g7f6 a4b5 a6b5 c2b4",
  "tarrasch-late-middle":
    "d2d4 d7d5 c2c4 e7e6 b1c3 c7c5 c4d5 e6d5 g1f3 b8c6 g2g3 g8f6 f1g2 f8e7 e1g1 e8g8 c1g5 c8e6 a1c1 c5d4 f3d4 d8d7 a2a3 e6h3 d4f3 f8d8 g5f6 e7f6 d1a4 h3g2 g1g2 d7e6 a4b3 g7g5 e2e3 g5g4 f3g1 a8c8 f1d1 f6c3 b3c3 e6e4 g2f1 d8e8",
  "tarrasch-middle":
    "d2d4 d7d5 c2c4 e7e6 b1c3 c7c5 c4d5 e6d5 g1f3 b8c6 g2g3 g8f6 f1g2 f8e7 e1g1 e8g8 c1g5 c8e6 a1c1 c5d4 f3d4 c6d4 d1d4 h7h6 g5f4 d8a5 d4d3",
  "trompowsky-middle":
    "d2d4 g8f6 c1g5 f6e4 g5f4 d7d5 e2e3 c7c5 f1d3 e4f6 c2c3 b8c6 b1d2 c8g4 g1e2 e7e6 e1g1 f8d6 f2f3 g4h5 d1b3 a8b8 b3a3 d6f4 e2f4 c5c4 f4h5 f6h5 d3e2 b7b5 b2b3 h5f6",
  "two-knights-middle":
    "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5 d7d5 e4d5 c6a5 c4b5 c7c6 d5c6 b7c6 b5e2 h7h6 g5f3 e5e4 f3e5 f8d6 d2d4 e4d3 e5d3 e8g8 e1g1 d8c7 e2f3 c8f5 h2h3 a8d8 b1d2",
  "vienna-middle":
    "e2e4 e7e5 b1c3 g8f6 f1c4 b8c6 d2d3 f8c5 g1f3 h7h6 a2a3 a7a6 c1e3 c5e3 f2e3 d7d6 d3d4 c8g4 d1d3 e8g8",
  "winawer-late-middle":
    "e2e4 e7e6 d2d4 d7d5 b1c3 f8b4 e4e5 c7c5 a2a3 b4c3 b2c3 g8e7 g1f3 b7b6 f1d3 c8a6 e1g1 a6d3 d1d3 b8c6 f1e1 d8c7 h2h4 c5d4 c3d4 h7h6 a3a4 a8c8 c1a3 c6a5 e1c1 a5c4 c2c3 c4a3 a1a3 e8g8 f3d2 e7c6 g2g3 c7e7 c1a1 c8c7 a3a2 f8c8 g1h2 e7d8 d2f1 c6a5 a1c1 c7c6 f1e3 d8c7 e3d1 c7e7 h2g1 e7d8 g1g2 d8f8 f2f4 f7f5",
  "winawer-middle":
    "e2e4 e7e6 d2d4 d7d5 b1c3 f8b4 e4e5 c7c5 a2a3 b4c3 b2c3 g8e7 g1f3 b7b6 f1d3 c8a6 e1g1 a6d3 d1d3 b8c6 h2h4 a8c8 h4h5 h7h6 d4c5 b6c5 c1d2",
  "alekhine-end":
    "e2e4 g8f6 e4e5 f6d5 d2d4 d7d6 g1f3 c8g4 f1e2 e7e6 e1g1 f8e7 c2c4 d5b6 e5d6 c7d6 b1c3 e8g8 g1h1 e7f6 h2h3 g4f3 e2f3 b8c6 c4c5 d6c5 d4c5 d8d1 f3d1 f6c3 c5b6 c3d4 b6a7 a8a7 d1e2 a7a5 e2f3 c6e5 f3e4 b7b6 c1d2 a5b5 a1d1 b5b2 d2f4 b2b4 f1e1 d4b2 f4e5 b2e5 e4h7 g8h7 e1e5 b4b2 h1g1 f8c8 a2a4 g7g6 a4a5 c8c7 d1f1 c7a7 a5b6 a7d7",
  "benoni-later-end":
    "d2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3 e6d5 c4d5 d7d6 e2e4 g7g6 h2h3 b8d7 d1c2 d8e7 a2a4 h7h6 c1e3 f8g7 f1e2 e8g8 g1f3 f6h7 c2d2 h7f6 e2d3 f6e4 c3e4 f7f5 e4d6 e7d6 e3h6 f8e8 d3e2 g7h6 d2h6 b7b6 e1f1 e8e2 f1e2 c8a6 e2d1 d6d5 h6d2 a6d3 a1a3 c5c4 h1e1 d5d6 d2c3 a8d8 c3d4 d6d4 f3d4 d7c5",
  "berlin-end":
    "e2e4 e7e5 g1f3 b8c6 f1b5 g8f6 e1g1 f6e4 d2d4 e4d6 b5c6 d7c6 d4e5 d6f5 d1d8 e8d8 b1c3 d8e8 h2h3 f8e7 f1d1 h7h6 c3e2 a7a5 a2a4 g7g5 e2c3 f5g7 f3d4 g7f5 c3e4 f5d4 d1d4 c6c5 d4d2 c8e6 d2d1 b7b6 g2g4 a8d8 c1e3 e6d7 g1h2 d7c6 e4f6 e7f6 e5f6 d8d6 d1d6 c7d6 f2f4 h6h5 a1e1 h5g4 e3c5 e8f8 c5d6 f8g8 e1e3 g5f4 e3c3 h8h3 c3h3 g4h3",
  "bogo-indian-end":
    "d2d4 g8f6 c2c4 e7e6 g1f3 f8b4 c1d2 b4d2 d1d2 e8g8 g2g3 d7d5 f1g2 d5c4 b1a3 c7c5 e1g1 b8c6 d4c5 d8e7 d2d6 e7d6 c5d6 c4c3 f1b1 f8d8 a3c4 f6e4 a2a4 e4d6 c4d6 c3b2 b1b2 d8d6 a4a5 g8f8 a5a6 a8b8 a6b7 b8b7 b2a2 b7d7 f3e1 c6b4 a2a5 d6a6 a5a6 c8a6 e1c2 b4c2 a1a6 d7d1 g2f1 d1a1 a6c6 c2b4 c6c8 f8e7 e2e4 e7f6 f2f4 h7h6 c8c7 g7g5 g1f2",
  "botvinnik-english-end":
    "c2c4 g7g6 b1c3 f8g7 g2g3 e7e5 f1g2 d7d6 e2e4 b8c6 g1e2 g8f6 e1g1 e8g8 d2d3 a7a6 c1e3 a8b8 b2b3 f6g4 e3d2 c6e7 h2h3 g4f6 a1c1 c7c5 f2f4 e5f4 d2f4 e7c6 d1d2 f6e8 c3d5 c8e6 g1h2 e6d5 e4d5 c6d4 f4g5 f7f6 g5f4 d4e2 d2e2 f6f5 b3b4 c5b4 c4c5 g6g5 e2e6 g8h8 f4e3 f8f6 e3g5 f6e6 g5d8 e6e2 d8b6 d6c5 b6a7 b8d8 a7c5 d8d5 f1e1 e2e1 c1e1 d5e5 e1e5 g7e5 g2b7 a6a5 b7c6",
  "botvinnik-english-late-end":
    "c2c4 g7g6 b1c3 f8g7 g2g3 e7e5 f1g2 d7d6 e2e4 b8c6 g1e2 g8f6 e1g1 e8g8 d2d3 a7a6 c1e3 a8b8 b2b3 f6g4 e3d2 c6e7 h2h3 g4f6 a1c1 c7c5 f2f4 e5f4 d2f4 e7c6 d1d2 f6e8 c3d5 c8e6 g1h2 e6d5 e4d5 c6d4 f4g5 f7f6 g5f4 d4e2 d2e2 f6f5 b3b4 c5b4 c4c5 g6g5 e2e6 g8h8 f4e3 f8f6 e3g5 f6e6 g5d8 e6e2 d8b6 d6c5 b6a7 b8d8 a7c5 d8d5 f1e1 e2e1 c1e1 d5e5 e1e5 g7e5 g2b7 a6a5 b7c6 e8f6 c5b6 f6h5 h2g2 h5g3 b6a5 e5d6 g2f3 h8g7",
  "carlsbad-end":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c4d5 e6d5 c1g5 f8e7 e2e3 e8g8 f1d3 b8d7 d1c2 f8e8 g1e2 d7f8 e1g1 c7c6 a1e1 g7g6 g5h4 f8e6 a2a3 a7a5 c2c1 e6g7 e2g3 b7b5 c1c2 c8d7 h2h3 a8b8 c2c1 b5b4 a3b4 b8b4 c1c2 h7h6 f2f4 d8b8 e1e2 f6e4 h4e7 e4g3 e7b4 a5b4 c3a4 g3e2 c2e2 d7f5 a4c5 f5d3 e2d3 e8e7 g2g4 g7e6 c5e6 e7e6 f1f3 e6e4 d3a6 b8e8 g1f2 c6c5 d4c5 e4c4 f2g3 c4c5 a6b7 e8e4 b7b8 g8g7 f4f5 g6f5 b8f4 b4b3 h3h4 c5c1 f4f5 c1g1 g3h3 g1h1 h3g2 e4f5 f3f5",
  "carlsbad-late-end":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c4d5 e6d5 c1g5 f8e7 e2e3 e8g8 f1d3 b8d7 d1c2 f8e8 g1e2 d7f8 e1g1 c7c6 a1e1 g7g6 g5h4 f8e6 a2a3 a7a5 c2c1 e6g7 e2g3 b7b5 c1c2 c8d7 h2h3 a8b8 c2c1 b5b4 a3b4 b8b4 c1c2 h7h6 f2f4 d8b8 e1e2 f6e4 h4e7 e4g3 e7b4 a5b4 c3a4 g3e2 c2e2 d7f5 a4c5 f5d3 e2d3 e8e7 g2g4 g7e6 c5e6 e7e6 f1f3 e6e4 d3a6 b8e8 g1f2 c6c5 d4c5 e4c4 f2g3 c4c5 a6b7 e8e4 b7b8 g8g7 f4f5 g6f5 b8f4",
  "caro-kann-end":
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4 h7h6 f1d3 g6d3 d1d3 b8d7 c1d2 g8f6 g1e2 d8c7 g3e4 a7a6 e1c1 e7e6 c2c4 f6e4 d3e4 d7f6 e4f3 h6h5 h1e1 e8c8 d2f4 c7a5 e2c3 a5f5 d4d5 f8d6 f4d6 f5f3 g2f3 d8d6 d5e6 d6e6 e1e6 f7e6 c1c2 e6e5 c2d3 h8f8 d3e2 f8d8 d1d8 c8d8 c3e4 f6d7 f3f4 g7g6 e4d6 e5f4",
  "caro-kann-late-end":
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4 h7h6 f1d3 g6d3 d1d3 b8d7 c1d2 g8f6 g1e2 d8c7 g3e4 a7a6 e1c1 e7e6 c2c4 f6e4 d3e4 d7f6 e4f3 h6h5 h1e1 e8c8 d2f4 c7a5 e2c3 a5f5 d4d5 f8d6 f4d6 f5f3 g2f3 d8d6 d5e6 d6e6 e1e6 f7e6 c1c2 e6e5 c2d3 h8f8 d3e2 f8d8 d1d8 c8d8 c3e4 f6d7 f3f4 g7g6 e4d6 e5f4 e2f3 b7b6 d6e4 d8e7 f3f4 e7f7 b2b4",
  "catalan-end":
    "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2 f8e7 g1f3 e8g8 e1g1 c7c5 c4d5 f6d5 b1c3 b8c6 a1b1 d8a5 d4c5 a5c5 c1d2 f8d8 b1c1 h7h6 c3d5 c5d5 a2a3 e7f6 b2b3 d5f5 d1c2 f5h5 c2c4 f6b2 c1d1 b2a3 d2f4 d8e8 c4a4 h5a5 f3e5 a5a4 b3a4 c6a5 d1a1 a3c5 f1b1 f7f6 b1b5 c5b6 f4d2 f6e5 d2a5 c8d7 g2b7 a8b8 b7g2 d7b5 a4b5 e8e7",
  "catalan-late-end":
    "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2 f8e7 g1f3 e8g8 e1g1 c7c5 c4d5 f6d5 b1c3 b8c6 a1b1 d8a5 d4c5 a5c5 c1d2 f8d8 b1c1 h7h6 c3d5 c5d5 a2a3 e7f6 b2b3 d5f5 d1c2 f5h5 c2c4 f6b2 c1d1 b2a3 d2f4 d8e8 c4a4 h5a5 f3e5 a5a4 b3a4 c6a5 d1a1 a3c5 f1b1 f7f6 b1b5 c5b6 f4d2 f6e5 d2a5 c8d7 g2b7 a8b8 b7g2 d7b5 a4b5 e8e7 a5b6 b8b6 g2c6 g7g5 g1g2 h6h5 a1a3 g8f8 g2f3 b6b8 f3e4 e7c7 e4e5 f8e7 f2f4 g5f4 g3f4 h5h4",
  "chebanenko-end":
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 a7a6 e2e3 b7b5 b2b3 c8g4 f1e2 e7e6 e1g1 b8d7 c1b2 f8d6 h2h3 g4f5 e2d3 e8g8 d1c2 f5d3 c2d3 d5c4 b3c4 d7b6 f3d2 e6e5 c4b5 a6b5 d4e5 d6e5 d3c2 d8e7 a2a4 b5b4 c3d1 b6d5 b2e5 e7e5 d2b3 a8c8 d1b2 c6c5 a4a5 e5d6 c2d3 d6e6 d3c4 f6e4 a5a6 e4d6 c4g4 d5c3 g4e6 f7e6 a6a7 c8a8 b3c5 f8f7 b2d3 d6e4 c5e4 c3e4 f1b1 e4c3 b1b4 f7a7 b4b8 a8b8 a1a7 c3e4 a7a4 e4d2 f2f4 h7h5 g1f2 b8c8 d3e5 c8c2 f2g1 c2b2 a4d4 b2c2 g2g3 d2b1 g3g4 b1c3 d4c4 h5g4 h3g4 c3e2 g1f2 c2c4 e5c4 e2c3",
  "chigorin-end":
    "d2d4 d7d5 c2c4 b8c6 b1c3 g8f6 g1f3 c8g4 c4d5 f6d5 e2e4 d5c3 b2c3 e7e5 d4d5 c6b8 d1a4 b8d7 c1e3 f8d6 a4c2 g4f3 g2f3 d6c5 f1b5 e8g8 e1g1 c5e3 f2e3 d8g5 g1h1 d7c5 c2f2 g5f6 f2g3 a8d8 b5c4 g8h8 f1g1 d8d6 c4f1 f8b8 a1e1 b8c8 g1g2 d6b6 g3g4 c8g8 g4f5 f6f5 e4f5 g7g6 e3e4 g6f5 g2g8 h8g8 e4f5 c5d7 c3c4 g8f8 c4c5 d7c5 e1c1 c5d7 c1c7 f8e7 a2a4 e7d6 c7c8 d7f6 f1d3 b6b4 a4a5 b4d4 d3e4 f6e4 f3e4",
  "closed-sicilian-end":
    "e2e4 c7c5 b1c3 b8c6 g2g3 g7g6 f1g2 f8g7 d2d3 d7d6 f2f4 e7e6 g1f3 g8e7 e1g1 e8g8 c1e3 c6d4 d1d2 a8b8 a2a4 b7b6 c3d1 e7c6 e3f2 d4f3 g2f3 c8b7 f3g2 d8d7 c2c3 d6d5 d2e2 d5d4 c3c4 e6e5 f4f5 g6f5 g2h3 c6e7 f2e1 d7c6 h3f5 e7f5 f1f5 b7c8 d1f2 c8f5 e4f5 a7a6 g3g4 b6b5 b2b3 b5c4 b3c4 b8b7 f2e4 f8b8 e2d1 b7b2 g4g5 c6b7 e1g3 b2b1 d1b1 b7b1 a1b1 b8b1 g1f2 h7h6",
  "evans-gambit-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 b2b4 c5b4 c2c3 b4a5 d2d4 e5d4 e1g1 d7d6 c3d4 a5b6 b1c3 c6a5 c4d3 g8e7 h2h3 e8g8 f1e1 c7c5 c3a4 c8d7 a4b6 a7b6 d4d5 e7g6 a2a4 f7f6 c1e3 h7h6 e3d2 f6f5 e4e5 d6e5 f3e5 g6e5 e1e5 c5c4 d2a5 c4d3 a5c3 f8e8 d1d3 e8e5 c3e5 d8e8 d3g3 e8e7 a1b1 a8a5 b1b6 a5d5 e5g7 e7g5 g3g5 h6g5 g7f6 g5g4 h3g4 f5g4",
  "french-late-end":
    "e2e4 e7e6 d2d4 d7d5 b1c3 g8f6 e4e5 f6d7 f2f4 c7c5 g1f3 b8c6 f1e2 a7a6 c1e3 f8e7 e1g1 d8c7 g1h1 c6d4 f3d4 c5d4 d1d4 b7b5 b2b4 d7b8 a2a3 c8b7 d4d3 e8g8 e3g1 f8c8 f1f3 b8c6 f3h3 g7g6 a1e1 e7f8 e2g4 c6e7 g1d4 c7c6 d3g3 c6e8 g3d3 a6a5 c3b5 b7a6 b5d6 a6d3 d6e8 c8e8 h3d3 a5b4 a3b4 e7c6 e1b1 c6b4 d3c3 a8a4 b1d1 a4a8 g2g3 b4a2 c3b3 a8c8 b3b2 a2c3 d4c3 c8c3 g4e2 f8h6 e2d3 c3a3 h1g2 e8a8",
  "french-later-end":
    "e2e4 e7e6 d2d4 d7d5 b1c3 g8f6 e4e5 f6d7 f2f4 c7c5 g1f3 b8c6 f1e2 a7a6 c1e3 f8e7 e1g1 d8c7 g1h1 c6d4 f3d4 c5d4 d1d4 b7b5 b2b4 d7b8 a2a3 c8b7 d4d3 e8g8 e3g1 f8c8 f1f3 b8c6 f3h3 g7g6 a1e1 e7f8 e2g4 c6e7 g1d4 c7c6 d3g3 c6e8 g3d3 a6a5 c3b5 b7a6 b5d6 a6d3 d6e8 c8e8 h3d3 a5b4 a3b4 e7c6 e1b1 c6b4 d3c3 a8a4 b1d1 a4a8 g2g3 b4a2 c3b3 a8c8 b3b2 a2c3 d4c3 c8c3",
  "french-tarrasch-end":
    "e2e4 e7e6 d2d4 d7d5 b1d2 c7c5 e4d5 e6d5 g1f3 b8c6 f1b5 f8d6 e1g1 g8e7 d4c5 d6c5 d2b3 c5d6 f1e1 e8g8 b5d3 c8f5 d3f5 e7f5 g2g3 f5e7 c1e3 d8c7 c2c3 f8e8 e3c5 h7h6 c5d6 c7d6 d1e2 a8d8 e2b5 d6c7 e1e3 a7a6 b5d3 e7g6 b3d4 c6d4 d3d4 c7a5 d4d3 a5b6 a1b1 e8e3 d3e3 b6e3 f2e3 g6e7 g1f2 d8d6 b1d1 g7g6 f2e2 g8g7 f3d4 g7f8 d1d2 h6h5 a2a4 e7g8 d4b3 b7b6 c3c4 g8f6 c4d5 d6d5 d2d5 f6d5 b3d2 f8e7 e2d3 e7e6 d2f3 e6d6 e3e4 d5b4 d3c4 b4c6 b2b4 c6e5 f3e5 d6e5",
  "french-tarrasch-knight-end":
    "e2e4 e7e6 d2d4 d7d5 b1d2 c7c5 e4d5 e6d5 g1f3 b8c6 f1b5 f8d6 e1g1 g8e7 d4c5 d6c5 d2b3 c5d6 f1e1 e8g8 b5d3 c8f5 d3f5 e7f5 g2g3 f5e7 c1e3 d8c7 c2c3 f8e8 e3c5 h7h6 c5d6 c7d6 d1e2 a8d8 e2b5 d6c7 e1e3 a7a6 b5d3 e7g6 b3d4 c6d4 d3d4 c7a5 d4d3 a5b6 a1b1 e8e3 d3e3 b6e3 f2e3 g6e7 g1f2 d8d6 b1d1 g7g6 f2e2 g8g7 f3d4 g7f8 d1d2 h6h5 a2a4 e7g8 d4b3 b7b6 c3c4 g8f6 c4d5 d6d5 d2d5 f6d5",
  "grunfeld-end":
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3 b2c3 f8g7 g1f3 e8g8 a1b1 c8g4 h2h3 g4f3 g2f3 c7c5 f1c4 d8a5 c1d2 b8c6 e1f1 c5d4 c3d4 a5c7 d4d5 c6d4 b1c1 a8c8 h3h4 c7d7 d2e3 e7e5 f3f4 e5f4 e3d4 g7d4 d1d4 b7b5 f2f3 c8c4 c1c4 b5c4 h4h5 d7a4 h5h6 f7f6 h1h2 f8b8 h2b2 b8b2 d4b2 g6g5 b2f6 a4d1 f1f2 d1d2 f2f1",
  "hedgehog-end":
    "c2c4 c7c5 g1f3 g8f6 b1c3 e7e6 g2g3 b7b6 f1g2 c8b7 e1g1 f8e7 d2d4 c5d4 d1d4 d7d6 f1d1 a7a6 b2b3 b8d7 c1b2 e8g8 f3e1 b7g2 g1g2 d8b8 c3e4 f8c8 e4f6 d7f6 d4d3 b6b5 a1c1 b8b7 d3f3 f6e4 c1c2 b5c4 b3c4 c8c7 h2h4 a6a5 b2d4 a8f8 d4e3 a5a4 c4c5 e4c5 e1d3 c5d3 f3b7 c7b7 d1d3 d6d5 d3c3 h7h6 e3c1 f8a8 h4h5 f7f6 c3c7 b7a7 g2f3 a7c7 c2c7 g8f8 e2e4 a8a5 g3g4 d5e4 f3e4 f6f5 e4f3 f5g4 f3g4 a5c5 c7c5 e7c5",
  "italian-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d3 d7d6 h2h3 e8g8 c1g5 c5b6 c4b3 c8e6 b1d2 h7h6 g5e3 b6e3 f2e3 d6d5 d1e2 f6h5 d2f1 f8e8 e1c1 h5f6 e4d5 e6d5 b3c4 c6a5 e3e4 d5c6 g2g4 a5c4 d3c4 d8e7 f3d2 a8d8 f1g3 e7e6 d1f1 d8d6 g4g5 f6d7 g5h6 e6h6 g3f5 h6d2 e2d2 d6d2 c1d2 c6e4 h1g1 e4f5 f1f5 f7f6 f5f2 g8f7",
  "italian-late-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d3 d7d6 h2h3 e8g8 c1g5 c5b6 c4b3 c8e6 b1d2 h7h6 g5e3 b6e3 f2e3 d6d5 d1e2 f6h5 d2f1 f8e8 e1c1 h5f6 e4d5 e6d5 b3c4 c6a5 e3e4 d5c6 g2g4 a5c4 d3c4 d8e7 f3d2 a8d8 f1g3 e7e6 d1f1 d8d6 g4g5 f6d7 g5h6 e6h6 g3f5 h6d2 e2d2 d6d2 c1d2 c6e4 h1g1 e4f5 f1f5 f7f6 f5f2 g8f7 f2g2 e8g8 h3h4 d7f8 d2e3",
  "kings-indian-attack-end":
    "e2e4 e7e6 d2d3 d7d5 b1d2 c7c5 g1f3 b8c6 g2g3 g7g6 f1g2 f8g7 e1g1 g8e7 f1e1 e8g8 e4e5 b7b6 h2h4 h7h6 d2f1 c8b7 f1h2 e7f5 c1f4 d5d4 d1d2 g8h7 e1e2 c6b4 g3g4 f5e7 d2d1 f8h8 d1f1 h7g8 f4d2 b4c2 a1c1 c5c4 d2f4 c4d3 e2d2 b7e4 f3e1 e4g2 f1g2 c2e1 c1e1 d8d5 d2d3 a8d8 g2d5 d8d5 h2f3 h6h5 g4g5 e7c6 e1c1 d5c5 c1c5 b6c5 g1f1 g8h7 d3b3 h8c8 b3b5 c6e7 f4d2 d4d3 b5a5 c8c7 f1e1 c5c4 e1d1 g7f8 a5a4 h7g7 d2a5 c7c5 f3d2 e7f5 d2c4 a7a6 a5b4 c5d5 b4f8 g7f8 c4e3 d5d4 a4d4 f5d4 e3g2",
  "kings-indian-attack-late-end":
    "e2e4 e7e6 d2d3 d7d5 b1d2 c7c5 g1f3 b8c6 g2g3 g7g6 f1g2 f8g7 e1g1 g8e7 f1e1 e8g8 e4e5 b7b6 h2h4 h7h6 d2f1 c8b7 f1h2 e7f5 c1f4 d5d4 d1d2 g8h7 e1e2 c6b4 g3g4 f5e7 d2d1 f8h8 d1f1 h7g8 f4d2 b4c2 a1c1 c5c4 d2f4 c4d3 e2d2 b7e4 f3e1 e4g2 f1g2 c2e1 c1e1 d8d5 d2d3 a8d8 g2d5 d8d5 h2f3 h6h5 g4g5 e7c6 e1c1 d5c5 c1c5 b6c5 g1f1 g8h7 d3b3 h8c8 b3b5 c6e7 f4d2 d4d3 b5a5 c8c7 f1e1 c5c4 e1d1 g7f8 a5a4 h7g7 d2a5 c7c5 f3d2 e7f5 d2c4 a7a6 a5b4 c5d5 b4f8 g7f8 c4e3 d5d4 a4d4 f5d4 e3g2 d4f3 g2e1 f3h4 e1d3 h4f3 d1e2 f3d4 e2e3 d4c6 f2f4 a6a5 a2a3",
  "kings-indian-saemisch-end":
    "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 f2f3 e8g8 c1e3 b8c6 g1e2 a7a6 d1d2 a8b8 c3d5 b7b5 a1c1 c8d7 d5f6 e7f6 c4b5 a6b5 e2c3 b5b4 c3d5 f6f5 e3g5 f7f6 g5f4 f5e4 f3e4 g8h8 f1e2 f8e8 e2f3 f6f5 e4e5 d8h4 g2g3 c6d4 e1g1 d4f3 f1f3 h4g4 f3d3 d7b5 e5d6 b5d3 d6c7 g7d4 f4e3 g4e4 c7b8b e4d5 b8f4 d5e4 g1f2 d4e3 d2e3 h8g8 c1d1 d3b5 e3e4 e8e4 d1e1 b5d3 b2b3 g8f7 f4d2 f7f6 e1e4 d3e4 f2e1",
  "modern-end":
    "e2e4 g7g6 d2d4 f8g7 b1c3 d7d6 c1e3 a7a6 d1d2 b7b5 f2f3 b8d7 h2h4 h7h5 g1h3 c8b7 e1c1 c7c5 h3g5 c5d4 e3d4 g7d4 d2d4 g8f6 c1b1 a8c8 d4d2 d8b6 f1e2 c8c7 d1c1 b6a5 d2e3 e8f8 h1f1 f8g7 c3d1 a5b6 e2d3 d7c5 e3e2 c5d3 e2d3 b5b4 c2c4 b4c3 c1c3 h8c8 c3c7 c8c7 d3b3 b6b3 a2b3 d6d5 e4e5 f6h7 g5h7 g7h7 f1e1 d5d4 d1f2 b7d5 b3b4 d5e6 f2e4",
  "nimzo-indian-end":
    "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8 f1d3 d7d5 c1d2 h7h6 g1f3 c7c5 c4d5 e6d5 d3c2 b8c6 a2a3 b4a5 d4c5 d5d4 e3d4 c6d4 f3d4 d8d4 e1g1 a5c7 c3b5 d4c5 b5c7 c5c7 a1c1 c7b6 d2e3 b6a5 h2h3 c8f5 c2b3 a8d8 c1c5 a5c5 e3c5 d8d1 f1d1 f8a8 c5d4 a7a5 a3a4 a8c8 d4c3 f6d7 c3d4 c8c7 f2f3 b7b6 d4e3 d7c5 e3c5 b6c5",
  "nimzo-indian-late-end":
    "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8 f1d3 d7d5 c1d2 h7h6 g1f3 c7c5 c4d5 e6d5 d3c2 b8c6 a2a3 b4a5 d4c5 d5d4 e3d4 c6d4 f3d4 d8d4 e1g1 a5c7 c3b5 d4c5 b5c7 c5c7 a1c1 c7b6 d2e3 b6a5 h2h3 c8f5 c2b3 a8d8 c1c5 a5c5 e3c5 d8d1 f1d1 f8a8 c5d4 a7a5 a3a4 a8c8 d4c3 f6d7 c3d4 c8c7 f2f3 b7b6 d4e3 d7c5 e3c5 b6c5 d1d8 g8h7 d8a8 c5c4 a8a5 c4b3 a5f5 c7c2 f5f7 c2b2 f3f4 b2b1 g1h2 b1f1 f7b7",
  "panov-end":
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 c2c4 g8f6 b1c3 e7e6 g1f3 f8b4 c4d5 f6d5 c1d2 e8g8 f1d3 b8c6 e1g1 b4e7 a1c1 e7f6 d1e2 c6d4 f3d4 f6d4 f1d1 e6e5 c3b5 f8e8 b5d4 e5d4 e2f3 d5f6 h2h3 d8b6 d2g5 c8d7 g5f6 b6f6 f3b7 e8d8 b7a6 f6a6 d3a6 d7f5 c1c7 f5e6 b2b3 g8f8 a6b7 a8b8 b7a6 g7g6 g1f1 g6g5 d1d2 b8a8 c7c5",
  "pawn-caro-kann-endgame":
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4 h7h6 f1d3 g6d3 d1d3 b8d7 c1d2 g8f6 g1e2 d8c7 g3e4 a7a6 e1c1 e7e6 c2c4 f6e4 d3e4 d7f6 e4f3 h6h5 h1e1 e8c8 d2f4 c7a5 e2c3 a5f5 d4d5 f8d6 f4d6 f5f3 g2f3 d8d6 d5e6 d6e6 e1e6 f7e6 c1c2 e6e5 c2d3 h8f8 d3e2 f8d8 d1d8 c8d8 c3e4 f6d7 f3f4 g7g6 e4d6 e5f4 e2f3 b7b6 d6e4 d8e7 f3f4 e7f7 b2b4 c6c5 b4b5 a6b5 c4b5 f7e6 e4d2 d7e5 f4e4 e5f7 d2c4 f7d6 c4d6 e6d6",
  "pawn-english-endgame":
    "c2c4 e7e5 b1c3 g8f6 g1f3 b8c6 g2g3 f8b4 f1g2 e8g8 c3d5 d7d6 e1g1 f6d5 c4d5 c6d4 f3d4 e5d4 a2a3 b4a5 b2b4 a5b6 e2e4 a7a5 b4b5 a5a4 d1e2 a8a5 a1b1 d8e8 h2h4 h7h6 g1h2 c8d7 d2d3 a5b5 b1b5 d7b5 f2f4 c7c6 e4e5 c6d5 g2d5 d6e5 f4e5 b6c7 e5e6 f7e6 e2e6 g8h8 f1f8 e8f8 c1b2 f8d8 h2g2 b5d7 e6f7 d7c6 d5c6 b7c6 b2d4 d8d4 f7c7 d4d5 g2h2 d5a2 h2h3 a2e6 h3h2 h8h7 d3d4 e6a2 h2h3 a2e6 h3h2 e6e2 h2h3 e2f1 h3h2 f1e2 h2h3 e2f1 h3h2 f1f2 h2h3 f2f3 c7e5 h6h5 e5e1 g7g6 e1e7 h7h8 h3h2 c6c5 e7e5 h8h7 d4c5 f3f2 h2h3 f2f1 h3h2 f1f2 h2h1 f2f1 h1h2 f1c4 e5e7 h7g8 e7e3 c4c2 h2h1 c2d1 h1g2 d1c2 g2h3 c2c4 h3g2 c4c2 e3f2 c2c4 g2h1 c4c1 h1g2 c1d1 f2a2 d1b3 a2b3 a4b3",
  "pawn-london-endgame":
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5 e2e3 b8c6 c2c3 e7e6 f1b5 c8d7 e1g1 f8e7 f1e1 e8g8 b5d3 d7e8 f3e5 f6e4 h2h3 c6e5 d4e5 e8c6 b1d2 a7a5 d1c2 e4d2 c2d2 b7b5 d2e2 d8c7 a1d1 a8b8 e3e4 c5c4 d3b1 d5e4 b1c2 h7h6 c2e4 b8d8 e4c6 d8d1 e2d1 c7c6 d1g4 g8h7 g4d1 a5a4 a2a3 f8g8 d1b1 h7h8 e1d1 g7g5 f4e3 g5g4 h3h4 e7h4 e3h6 g4g3 f2f3 f7f5 e5f6 h4f6 h6e3 h8g7 d1d2 g8d8 d2d8 f6d8 g1f1 d8b6 e3b6 c6b6 b1e1 b6d6 e1e2 g7f7 f1e1 d6b6 e1d2 b6d6 d2e3 e6e5 e2d2 d6d2 e3d2",
  "pawn-queens-gambit-endgame":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1g5 f8e7 c4d5 e6d5 g1f3 c8e6 a1c1 h7h6 g5f6 e7f6 a2a3 b8d7 e2e3 a8c8 f1d3 c7c6 b2b4 a7a5 c3e2 a5b4 a3b4 d8e7 d1b3 d7b6 c1c5 e6g4 f3d2 g4e2 d3e2 e8g8 g2g3 f8e8 d2f3 b6c4 e1g1 b7b5 b3c2 e7b7 f3d2 f6e7 d2c4 d5c4 c5e5 e7b4 f1b1 e8e5 d4e5 b7e7 h2h4 b4a5 e2g4 c8d8 e5e6 h6h5 g4f5 f7e6 c2e4 g8f8 f5e6 d8d6 e4f4 f8e8 b1a1 e7e6 a1a5 d6d1 g1g2 c4c3 e3e4 c3c2 a5a8 d1d8 a8d8 e8d8 f4d2 d8c7 d2c2 b5b4 g2f3 c7b6 f3e3 b4b3 c2d3 b6c5 e3d2 e6c4 d3c4 c5c4 e4e5",
  "pawn-reti-endgame":
    "g1f3 d7d5 g2g3 g8f6 f1g2 e7e6 e1g1 f8e7 d2d3 e8g8 c2c4 c7c5 d1c2 b8c6 e2e3 h7h6 a2a3 f8e8 b2b3 e7f8 f1d1 d8c7 c1b2 e6e5 c4d5 f6d5 f3d2 c7d8 h2h3 a8b8 d2e4 c8e6 b1d2 b7b6 b3b4 f7f5 b4b5 c6d4 e3d4 e5d4 d2c4 f5e4 d3e4 d5f6 a3a4 d8c7 a1a3 e6c4 c2c4 c7f7 c4c2 b8c8 e4e5 e8e5 b2d4 c5d4 c2c8 e5e8 c8c1 f8a3 c1a3 f6e4 g2e4 e8e4 d1c1 e4e2 c1c8 e2e8 c8e8 f7e8 g1g2 e8d8 a3a2 g8h8 g2f3 d8d7 f3e4 d7h3 e4d4 h3f5 d4e3 f5c5 e3d3 h8h7 d3e4 c5c3 g3g4 c3f6 a2d2 h7g6 d2f4 f6f4 e4f4",
  "pawn-tarrasch-endgame":
    "d2d4 d7d5 c2c4 e7e6 b1c3 c7c5 c4d5 e6d5 g1f3 b8c6 g2g3 g8f6 f1g2 f8e7 e1g1 e8g8 c1g5 c8e6 a1c1 c5d4 f3d4 d8d7 a2a3 e6h3 d4f3 f8d8 g5f6 e7f6 d1a4 h3g2 g1g2 d7e6 a4b3 g7g5 e2e3 g5g4 f3g1 a8c8 f1d1 f6c3 b3c3 e6e4 g2f1 d8e8 c3d3 e8d8 g1e2 c6e5 d3e4 d5e4 c1c8 d8c8 e2c3 c8c4 d1d4 c4d4 e3d4 e5d3 c3e4 d3b2 e4d6 b7b6 d6c8 b2c4 c8a7 c4a3 f1e2 g8g7 a7c6 g7f6 c6e5 h7h5 e5d7 f6f5 e2d3 b6b5 d4d5 b5b4 d3d4 a3b5 d4c4 b5c7 d7c5 f5e5 c5d3 e5d6 d3b4 f7f5 c4d3 c7d5 b4d5 d6d5 d3e3",
  "petroff-end":
    "e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3 f6e4 d2d4 d6d5 f1d3 f8e7 c2c4 e7b4 b1d2 c8e6 c4c5 b4d2 c1d2 e8g8 h2h3 d8f6 e1g1 e4d2 d1d2 f8e8 f1e1 b8c6 f3e5 e6f5 e5c6 b7c6 d3a6 g7g5 f2f4 g5f4 e1f1 e8e4 f1f4 e4f4 d2f4 f6g6 a1e1 f5e4 e1e2 g6g7 f4c7 g7d4 e2f2 e4g6 c7c6 a8b8 a6b5 a7a6 c6a6 d4c5 a2a4 c5c1 g1h2 c1c7 h2g1",
  "philidor-end":
    "e2e4 e7e5 g1f3 d7d6 d2d4 g8f6 b1c3 b8d7 f1c4 f8e7 e1g1 e8g8 f1e1 c7c6 a2a4 d8c7 h2h3 h7h6 c1e3 a7a5 d4d5 d7b6 c4b3 c8d7 d1d3 c6d5 e4d5 e7d8 f3d2 a8c8 f2f4 d8e7 g1h1 f8d8 d3f1 d8e8 f1f2 e7d8 f4f5 e8f8 e1g1 d7e8 g2g4 b6a4 b3a4 e8a4 a1a4 b7b5 c3b5 c7c2 b5d6 c2a4 d6c8 a4d7 g1c1 f6d5 d2e4 d8g5 e3g5 f8c8 g5e3 c8c1 e3c1 d7a4 f2e1 a4c6 h1h2 c6c2 h2g3 d5f4 c1f4 e5f4 g3f3 c2b2 e1a5 b2h2 e4f2 h2g3 f3e2 g3e3 e2f1 f4f3 a5d8 g8h7 d8d1 f7f6 f2d3 h6h5 g4h5 h7h6 d1c1 e3c1 d3c1 h6h5",
  "pianissimo-late-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 d2d3 g8f6 c2c3 d7d6 e1g1 e8g8 f1e1 a7a6 c4b3 c5a7 b1d2 h7h6 h2h3 c8e6 d2f1 e6b3 d1b3 b7b5 a2a4 a8b8 a4b5 a6b5 a1a6 d8d7 c1e3 a7e3 f1e3 f8e8 b3c2 c6e7 e1a1 c7c6 c3c4 c6c5 a6a7 d7d8 a1a6 e7c8 a7a8 b8a8 a6a8 b5b4 e3d5 f6d5 c4d5 d8d7 c2a4 d7a4 a8a4 c8b6 a4a6 e8b8 f3d2 g8f8 g1f1 f8e8 f1e2 b8b7 e2e3 e8d7 g2g3 b6c8 f2f4 b7a7 a6a7 c8a7",
  "pirc-end":
    "e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 g1f3 f8g7 f1e2 e8g8 a2a4 e7e5 d4e5 d6e5 d1d8 f8d8 c1d2 h7h6 e1c1 d8e8 e2c4 g7f8 h1e1 a7a6 h2h3 g6g5 a4a5 f8c5 e1f1 b8c6 c3d5 f6d5 e4d5 c6d8 d2e3 c5d6 g2g4 d6b4 c2c3 b4a5 c4a2 g8g7 b2b4 a5b6 e3b6 c7b6 f1e1 f7f6 f3d2 b6b5 d5d6 a6a5 d2e4 c8d7 a2d5 a5b4 c3b4 a8a6 c1b2 f6f5 g4f5 d7f5 e1e2 a6b6 e2c2 d8c6 c2c3 c6b4 c3c7 g7h8 d6d7 e8d8 e4g3 f5h3 d5b7 h8g7 c7c8 b6b7 g3h5 g7g6 d1d6 g6h5 c8d8",
  "pirc-later-end":
    "e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 g1f3 f8g7 f1e2 e8g8 a2a4 e7e5 d4e5 d6e5 d1d8 f8d8 c1d2 h7h6 e1c1 d8e8 e2c4 g7f8 h1e1 a7a6 h2h3 g6g5 a4a5 f8c5 e1f1 b8c6 c3d5 f6d5 e4d5 c6d8 d2e3 c5d6 g2g4 d6b4 c2c3 b4a5 c4a2 g8g7 b2b4 a5b6 e3b6 c7b6 f1e1 f7f6 f3d2 b6b5 d5d6 a6a5 d2e4 c8d7 a2d5 a5b4 c3b4 a8a6 c1b2 f6f5 g4f5 d7f5 e1e2 a6b6 e2c2 d8c6 c2c3 c6b4 c3c7 g7h8 d6d7 e8d8 e4g3 f5h3 d5b7 h8g7 c7c8 b6b7 g3h5 g7g6 d1d6 g6h5 c8d8 h3d7 d8d7 b7d7 d6d7 e5e4 b2c3 b4d3 c3d4",
  "queens-gambit-accepted-end":
    "d2d4 d7d5 c2c4 d5c4 g1f3 g8f6 e2e3 e7e6 f1c4 c7c5 d1e2 c5d4 f3d4 e6e5 d4f3 f8d6 c4b5 b8c6 e3e4 d8c7 e1g1 e8g8 h2h3 a7a6 b5c6 c7c6 f1e1 f8e8 b1c3 b7b5 c1g5 b5b4 c3b1 d6f8 b1d2 a6a5 a1c1 c6a6 b2b3 f6d7 g5e3 f7f6 e2c4 a6e6 f3h4 a5a4 c4e6 e8e6 c1c7 a4b3 d2b3 f8d6 c7c1 g8f7 h4f5 d6f8 c1c4 e6e8 c4c6 e8e6 c6c7 g7g6 e1c1 g6f5 c7c8 a8c8 c1c8",
  "queens-gambit-accepted-later-end":
    "d2d4 d7d5 c2c4 d5c4 g1f3 g8f6 e2e3 e7e6 f1c4 c7c5 d1e2 c5d4 f3d4 e6e5 d4f3 f8d6 c4b5 b8c6 e3e4 d8c7 e1g1 e8g8 h2h3 a7a6 b5c6 c7c6 f1e1 f8e8 b1c3 b7b5 c1g5 b5b4 c3b1 d6f8 b1d2 a6a5 a1c1 c6a6 b2b3 f6d7 g5e3 f7f6 e2c4 a6e6 f3h4 a5a4 c4e6 e8e6 c1c7 a4b3 d2b3 f8d6 c7c1 g8f7 h4f5 d6f8 c1c4 e6e8 c4c6 e8e6 c6c7 g7g6 e1c1 g6f5 c7c8 a8c8 c1c8 f5f4 e3d2 e6a6 b3c1 a6a4 c8c7 f7e8 c7c4",
  "queens-indian-petrosian-end":
    "d2d4 g8f6 c2c4 e7e6 g1f3 b7b6 a2a3 c8b7 b1c3 d7d5 c4d5 f6d5 e2e3 f8e7 f1b5 c7c6 b5d3 e8g8 e1g1 b8d7 c3e2 a8c8 e3e4 d5c7 b2b4 c6c5 d4c5 e7f6 a1a2 b6c5 e2g3 a7a6 c1f4 f8e8 d1e2 b7c6 a2d2 g7g6 f1c1 c7b5 b4c5 e6e5 f4e3 d8a5 d2b2 b5d4 e2d2 a5d2 f3d2 c6a4 d3a6 c8c5 c1c5 d7c5 b2b6 f6d8 b6b4 a4c6 a6b5 d4b5 e3c5 d8a5 b4b2 a5c3 b2a2 e8d8 c5b4 d8d2 a2d2 c3d2 b4d2",
  "queens-indian-petrosian-late-end":
    "d2d4 g8f6 c2c4 e7e6 g1f3 b7b6 a2a3 c8b7 b1c3 d7d5 c4d5 f6d5 e2e3 f8e7 f1b5 c7c6 b5d3 e8g8 e1g1 b8d7 c3e2 a8c8 e3e4 d5c7 b2b4 c6c5 d4c5 e7f6 a1a2 b6c5 e2g3 a7a6 c1f4 f8e8 d1e2 b7c6 a2d2 g7g6 f1c1 c7b5 b4c5 e6e5 f4e3 d8a5 d2b2 b5d4 e2d2 a5d2 f3d2 c6a4 d3a6 c8c5 c1c5 d7c5 b2b6 f6d8 b6b4 a4c6 a6b5 d4b5 e3c5 d8a5 b4b2 a5c3 b2a2 e8d8 c5b4 d8d2 a2d2 c3d2 b4d2 b5a3 g1h1 a3b5 g3e2 f7f5 e4f5 g8f7 d2c3 b5c3 f5g6 f7g7 e2c3 g7g6 c3e2 g6f5 e2c3 c6a8 c3d1 a8c6 d1e3 f5e4",
  "ragozin-late-end":
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 g1f3 f8b4 e2e3 e8g8 f1d3 d5c4 d3c4 c7c5 e1g1 b8c6 a2a3 b4a5 d4c5 d8d1 f1d1 a5c3 b2c3 c6a5 d1d4 f6d7 c5c6 b7c6 c4a2 c6c5 d4d1 d7b6 e3e4 b6a4 c1e3 c8b7 d1d7 f8d8 d7c7 a8c8 c7c8 d8c8 f3d2 a4c3 d2c4 a5c4 a2c4 c3e4 a1c1 e4d6 c4f1 c5c4 e3f4 c8d8 f2f3 b7d5 f4d6 d8d6 f1c4 g7g6 c4e2 d6c6 c1c6 d5c6 f3f4 g8g7 g1f2 g7f6 g2g3 g6g5 f2e3 h7h6 e2h5 c6e8 e3e4 e8d7 h5g4 d7a4 e4d4 a4b3 d4c3 b3d5 c3d4 d5b3 h2h3 g5f4 g3f4 b3c2 g4h5 c2g6 h5f3 g6b1 f3h5 b1g6 h5f3 f6f5 d4e3 h6h5 h3h4 e6e5 f4e5 f5e5 f3c6",
  "reti-late-end":
    "g1f3 d7d5 g2g3 g8f6 f1g2 e7e6 e1g1 f8e7 d2d3 e8g8 c2c4 c7c5 d1c2 b8c6 e2e3 h7h6 a2a3 f8e8 b2b3 e7f8 f1d1 d8c7 c1b2 e6e5 c4d5 f6d5 f3d2 c7d8 h2h3 a8b8 d2e4 c8e6 b1d2 b7b6 b3b4 f7f5 b4b5 c6d4 e3d4 e5d4 d2c4 f5e4 d3e4 d5f6 a3a4 d8c7 a1a3 e6c4 c2c4 c7f7 c4c2 b8c8 e4e5 e8e5 b2d4 c5d4 c2c8 e5e8 c8c1 f8a3 c1a3 f6e4 g2e4 e8e4 g1g2",
  "rook-bird-endgame":
    "f2f4 d7d5 g1f3 g7g6 g2g3 f8g7 f1g2 g8f6 e1g1 e8g8 d2d3 c7c5 d1e1 b8c6 c2c3 f8e8 b1a3 c8f5 f3h4 d8d7 e2e4 f5h3 e1e2 c5c4 e4e5 c4d3 e2d3 h3g2 g1g2 f6e4 c1e3 a8d8 a1e1 e8f8 a3c2 b7b5 e1e2 e7e6 c2d4 b5b4 c3b4 c6b4 d3b1 d7b7 f1d1 a7a5 a2a3 b4c6 d4c6 b7c6 e2c2 c6b7 e3d4 a5a4 h4f3 d8a8 h2h4 a8b8 f3g5 f8d8 c2c1 e4g5 h4g5 g7f8 g2h3 g8g7 b1d3 d8e8 h3g4 b8c8 c1c2 c8c2 d3c2 e8c8 c2a4 f8c5 d1c1 c8a8 a4d1 c5d4 d1d4 b7b5 g4h3 a8a4 d4c5 b5e2 c5e7 a4a8 e7b4 h7h5 g5h6 g7h6 b4e7 h6g7 e7f6 g7g8 f4f5 e6f5 a3a4 d5d4 c1c7 a8f8 e5e6 e2h5 f6h4 h5h4 h3h4",
  "rook-catalan-endgame":
    "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2 f8e7 g1f3 e8g8 e1g1 c7c5 c4d5 f6d5 b1c3 b8c6 a1b1 d8a5 d4c5 a5c5 c1d2 f8d8 b1c1 h7h6 c3d5 c5d5 a2a3 e7f6 b2b3 d5f5 d1c2 f5h5 c2c4 f6b2 c1d1 b2a3 d2f4 d8e8 c4a4 h5a5 f3e5 a5a4 b3a4 c6a5 d1a1 a3c5 f1b1 f7f6 b1b5 c5b6 f4d2 f6e5 d2a5 c8d7 g2b7 a8b8 b7g2 d7b5 a4b5 e8e7 a5b6 b8b6 g2c6 g7g5 g1g2 h6h5 a1a3 g8f8 g2f3 b6b8 f3e4 e7c7 e4e5 f8e7 f2f4 g5f4 g3f4 h5h4 e2e3 b8b6 a3a4 c7b7 c6b7 b6b5 e5e4 b5b7",
  "rook-italian-endgame":
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d3 d7d6 h2h3 e8g8 c1g5 c5b6 c4b3 c8e6 b1d2 h7h6 g5e3 b6e3 f2e3 d6d5 d1e2 f6h5 d2f1 f8e8 e1c1 h5f6 e4d5 e6d5 b3c4 c6a5 e3e4 d5c6 g2g4 a5c4 d3c4 d8e7 f3d2 a8d8 f1g3 e7e6 d1f1 d8d6 g4g5 f6d7 g5h6 e6h6 g3f5 h6d2 e2d2 d6d2 c1d2 c6e4 h1g1 e4f5 f1f5 f7f6 f5f2 g8f7 f2g2 e8g8 h3h4 d7c5 d2e3 c5e6 g2d2 b7b6 e3e4 g8h8 d2d7 f7e8 d7g7 e6g7 g1g7",
  "rook-nimzo-indian-endgame":
    "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8 f1d3 d7d5 c1d2 h7h6 g1f3 c7c5 c4d5 e6d5 d3c2 b8c6 a2a3 b4a5 d4c5 d5d4 e3d4 c6d4 f3d4 d8d4 e1g1 a5c7 c3b5 d4c5 b5c7 c5c7 a1c1 c7b6 d2e3 b6a5 h2h3 c8f5 c2b3 a8d8 c1c5 a5c5 e3c5 d8d1 f1d1 f8a8 c5d4 a7a5 a3a4 a8c8 d4c3 f6d7 c3d4 c8c7 f2f3 b7b6 d4e3 d7c5 e3c5 b6c5 d1d8 g8h7 d8a8 c5c4 a8a5 c4b3 a5f5",
  "rook-ruy-lopez-endgame":
    "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 d7d6 c2c3 e8g8 h2h3 f8e8 a4c2 d6d5 d2d3 d5e4 d3e4 e7f8 a2a4 f6h5 d1e2 h7h6 c1e3 a6a5 c2d3 d8f6 d3b5 c8e6 e1d1 e8e7 d1e1 c6b8 f3g5 h5f4 e3f4 f6f4 g5e6 e7e6 g2g3 f4g5 b1d2 g5d8 g1g2 d8e7 e1d1 b8d7 d2f1 d7b6 f1e3 a8d8 h3h4 e7f6 b5c4 e6d6 d1d6 f8d6 a1d1 g8f8 c4b3 b6d7 e3c4 d7c5 b3a2 f6e6 c4d6 e6a2 d6f5 d8e8 d1d5 b7b6 h4h5 c5e6 e2b5 a2b1 d5e5 e8d8 f5d4 e6d4 c3d4 b1d1 b2b4 d1a1 b4a5 a1d4 g2g1 d4c3 e5d5 d8e8 g1g2 c7c6 b5d3 c3d3 d5d3 b6a5",
  "ruy-lopez-later-end":
    "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 d7d6 c2c3 e8g8 h2h3 f8e8 a4c2 d6d5 d2d3 d5e4 d3e4 e7f8 a2a4 f6h5 d1e2 h7h6 c1e3 a6a5 c2d3 d8f6 d3b5 c8e6 e1d1 e8e7 d1e1 c6b8 f3g5 h5f4 e3f4 f6f4 g5e6 e7e6 g2g3 f4g5 b1d2 g5d8 g1g2 d8e7 e1d1 b8d7 d2f1 d7b6 f1e3 a8d8 h3h4 e7f6 b5c4 e6d6 d1d6 f8d6 a1d1 g8f8 c4b3 b6d7 e3c4 d7c5 b3a2 f6e6 c4d6 e6a2 d6f5 d8e8 d1d5 b7b6 h4h5 c5e6 e2b5 a2b1 d5e5 e8d8 f5d4 e6d4 c3d4 b1d1 b2b4 d1a1 b4a5 a1d4",
  "scandinavian-later-end":
    "e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 d2d4 g8f6 f1e2 c7c6 c1d2 h7h6 e2c4 c8g4 f2f3 g4f5 g2g4 f5h7 d1e2 a5c7 f3f4 b8d7 g4g5 f6d5 c3d5 c6d5 c4d5 e7e6 g1f3 e8c8 d5e4 f8d6 e4h7 h8h7 f3e5 d6e5 f4e5 c7c6 e1c1 h6g5 d2g5 d8h8 g5f4 d7b6 h1f1 b6d5 f4g3 g7g5 f1f3 b7b5 c1b1 c6c4 e2e1 c8b8 d1c1 b5b4 a2a3 a7a5 e1f1 h8c8 f1d3 g5g4 d3c4 c8c4 f3d3 b8c8 a3b4 a5b4 b1a2 h7h8 a2b3 c4c7",
  "scheveningen-end":
    "e2e4 c7c5 g1f3 e7e6 d2d4 c5d4 f3d4 a7a6 b1c3 d8c7 f1e2 g8f6 e1g1 d7d6 f2f4 f8e7 c1e3 e8g8 d1e1 b8c6 g1h1 c6d4 e3d4 b7b5 e2d3 c8b7 e1g3 b5b4 c3d1 g7g6 g3f3 f6h5 f3e3 e6e5 f4e5 d6e5 d4b6 c7c6 a2a3 b4a3 b6a5 f7f5 b2b3 f5e4 f1f8 a8f8 d3c4 g8h8 a5c3 f8f5 e3e1 e4e3 d1e3 h5f4 e1g3 a6a5 a1g1 c6e4 e3f5 e4f5 g3g4 f5e4 g4f3 e7d6 f3e4 b7e4 h2h3 f4g2 g1g2 h7h5 h1g1 d6c5 g1h2 e4g2 c3e5 h8h7 h2g2 g6g5 e5a1 c5f8 c4d3 h7h6 g2f3 f8d6 d3c4 d6e7 f3e3 e7f8 e3d3 f8g7 a1g7 h6g7",
  "scotch-late-end":
    "e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 f8c5 d4f5 d8f6 b1c3 g8e7 f1e2 d7d5 f5e3 c5e3 f2e3 d5e4 c3e4 f6g6 e4g3 h7h5 e2h5 g6g5 e1g1 g7g6 h5f3 g5h4 c1d2 c8e6 d2c3 h4h2 g1f2 h8h3 f3c6 b7c6 c3e5 e7f5 g3f5 h2e5 g2h3 e5h2 f2e1 e6f5 d1e2 h2h3 a1d1 a8b8 b2b3 b8b5 d1d4 b5a5 d4c4 f5e6 c4a4 a5a4 b3a4 h3h4 f1f2 h4a4 e2d2 a4a2 d2c3 a2b1 e1d2 b1h1",
  "slav-later-end":
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 d5c4 a2a4 c8f5 f3e5 d8c7 e5c4 g7g6 h2h3 b8a6 g2g3 a8d8 f1g2 a6b4 c4e3 e7e5 e3f5 g6f5 c1g5 f8e7 e1g1 d8d4 d1c1 c7c8 c3b5 d4d8 b5a7 c8e6 a4a5 e5e4 a5a6 b4a6 a1a6 b7a6 c1c6 e6c6 a7c6 d8d6 f1c1 f6d5 c6e7 d5e7",
  "sveshnikov-end":
    "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e5 d4b5 d7d6 c1g5 a7a6 b5a3 b7b5 c3d5 f8e7 g5f6 e7f6 c2c3 e8g8 a3c2 a8b8 a2a4 c6e7 d5f6 g7f6 a4b5 a6b5 c2b4 g8h8 f1d3 c8b7 d1h5 f6f5 e4f5 f7f6 e1g1 d8b6 g2g3 d6d5 a1e1 b6d6 b4c2 b5b4 c2b4 d5d4 d3e4 b7e4 e1e4 d6d7 f1a1 d7f5 h5f5 e7f5 a1a7 b8a8 a7a8 f8a8 g1f1 a8c8 b4d5 h8g7",
  "tarrasch-end":
    "d2d4 d7d5 c2c4 e7e6 b1c3 c7c5 c4d5 e6d5 g1f3 b8c6 g2g3 g8f6 f1g2 f8e7 e1g1 e8g8 c1g5 c8e6 a1c1 c5d4 f3d4 d8d7 a2a3 e6h3 d4f3 f8d8 g5f6 e7f6 d1a4 h3g2 g1g2 d7e6 a4b3 g7g5 e2e3 g5g4 f3g1 a8c8 f1d1 f6c3 b3c3 e6e4 g2f1 d8e8 c3d3 e8d8 g1e2 c6e5 d3e4 d5e4 c1c8 d8c8 e2c3 c8c4 d1d4 c4d4 e3d4 e5d3 c3e4 d3b2 e4d6 b7b6 d6c8 b2c4 c8a7 c4a3 f1e2",
  "trompowsky-end":
    "d2d4 g8f6 c1g5 f6e4 g5f4 d7d5 e2e3 c7c5 f1d3 e4f6 c2c3 b8c6 b1d2 c8g4 g1e2 e7e6 e1g1 f8d6 f2f3 g4h5 d1b3 a8b8 b3a3 d6f4 e2f4 c5c4 f4h5 f6h5 d3e2 b7b5 b2b3 h5f6 b3c4 d5c4 a3c5 d8b6 c5b6 a7b6 f1c1 e8g8 a2a4 b5a4 d2c4 f6d5 e3e4 d5c7 a1b1 b6b5 c4a3 c6a5 a3b5 c7b5 b1b5 b8b5 e2b5 a4a3 c1a1 f8b8 a1a3 b8b5 c3c4 b5b1 g1f2 a5c6 d4d5 e6d5 e4d5 c6b8 c4c5 g8f8 c5c6 b8c6 d5c6 b1c1 a3a8 f8e7 a8g8 g7g6 g8c8 c1c2 f2g3 e7d6 c6c7 c2c6 h2h3 f7f6 g3f4 c6c4 f4e3 c4c7 c8c7 d6c7",
  "trompowsky-late-end":
    "d2d4 g8f6 c1g5 f6e4 g5f4 d7d5 e2e3 c7c5 f1d3 e4f6 c2c3 b8c6 b1d2 c8g4 g1e2 e7e6 e1g1 f8d6 f2f3 g4h5 d1b3 a8b8 b3a3 d6f4 e2f4 c5c4 f4h5 f6h5 d3e2 b7b5 b2b3 h5f6 b3c4 d5c4 a3c5 d8b6 c5b6 a7b6 f1c1 e8g8 a2a4 b5a4 d2c4 f6d5 e3e4 d5c7 a1b1 b6b5 c4a3 c6a5 a3b5 c7b5 b1b5 b8b5 e2b5 a4a3 c1a1 f8b8 a1a3 b8b5 c3c4 b5b1 g1f2 a5c6 d4d5 e6d5 e4d5 c6b8 c4c5 g8f8 c5c6 b8c6 d5c6 b1c1",
  "two-knights-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5 d7d5 e4d5 c6a5 c4b5 c7c6 d5c6 b7c6 b5e2 h7h6 g5f3 e5e4 f3e5 f8d6 d2d4 e4d3 e5d3 e8g8 e1g1 d8c7 g1h1 c6c5 b2b3 c5c4 b3c4 a5c4 e2f3 a8b8 b1d2 c4e5 d3e5 d6e5 a1b1 b8b1 d2b1 c8a6 f3e2 a6e2 d1e2 e5h2 b1d2 f8e8 e2c4 h2d6 c4c7 d6c7 g2g3 e8c8 h1g2 c7a5 c2c4 a5b4 f1e1 b4d2 c1d2 c8c4 a2a3 f6e4 d2b4 a7a6 e1d1 c4c2 b4e1 f7f6 d1d4 e4c5 g2f3 h6h5 d4d6 c2b2 d6d5 b2b3 f3e2 c5e4 d5h5 e4d6 e1b4 d6b5 h5c5 b5a3 b4a3 b3a3 e2f1",
  "two-knights-late-end":
    "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5 d7d5 e4d5 c6a5 c4b5 c7c6 d5c6 b7c6 b5e2 h7h6 g5f3 e5e4 f3e5 f8d6 d2d4 e4d3 e5d3 e8g8 e1g1 d8c7 g1h1 c6c5 b2b3 c5c4 b3c4 a5c4 e2f3 a8b8 b1d2 c4e5 d3e5 d6e5 a1b1 b8b1 d2b1 c8a6 f3e2 a6e2 d1e2 e5h2 b1d2 f8e8 e2c4 h2d6 c4c7 d6c7 g2g3 e8c8 h1g2 c7a5 c2c4 a5b4 f1e1 b4d2 c1d2 c8c4 a2a3 f6e4 d2b4",
  "winawer-end":
    "e2e4 e7e6 d2d4 d7d5 b1c3 f8b4 e4e5 c7c5 a2a3 b4c3 b2c3 g8e7 g1f3 b7b6 f1d3 c8a6 e1g1 a6d3 d1d3 b8c6 f1e1 d8c7 h2h4 c5d4 c3d4 h7h6 a3a4 a8c8 c1a3 c6a5 e1c1 a5c4 c2c3 c4a3 a1a3 e8g8 f3d2 e7c6 g2g3 c7e7 c1a1 c8c7 a3a2 f8c8 g1h2 e7d8 d2f1 c6a5 a1c1 c7c6 f1e3 d8c7 e3d1 c7e7 h2g1 e7d8 g1g2 d8f8 f2f4 f7f5 c1c2 c6c4 g3g4 a5c6 g4f5 c6e7 d1e3 c4c6 h4h5 g8h8 a2a1 e7f5 e3f5 e6f5 a1e1 f8f7 d3f3 g7g5 f4g5 h6g5 c2f2 f5f4 c3c4 c6c4 e5e6 f7f6 f3d5 c4d4 d5e5 f6e5 e1e5",
};
