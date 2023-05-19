/* eslint-disable */
/*(c) shellderr 2023 BSD-1*/

const arr = [
  {
    //0
    axiom: 'F',
    theta: 60,
    delta: 4,
    n: 5,
    F: ['FF-[XY]+[XY]', 'FYF-[XY]+[--XY]'],
    X: '+F+--X+Y',
    Y: '-FX',
  },
  {
    //1
    theta: 45,
    delta: 10,
    n: 3,
    axiom: '+WF--YF--ZF',
    W: 'YF++ZF----XF[-YF----WF]++',
    X: '+YF--ZF[---WF--XF]+',
    Y: ['-WF++XF[+++YF++ZF]-', '+XF[YFZF]-', 'XX-F'],
    Z: '--YF++++WF[+ZF++++XF]--XF',
    F: 'FF',
  },
  {
    //2
    theta: 36,
    delta: 10,
    n: 2,
    axiom: '+WF--XF---YF--ZF',
    F: 'FF',
    W: ['YF++ZF----XF[+++]++', 'YF++ZF----XF[-YF----WF]++'],
    X: '+YF--ZF[---WF--XF]+',
    Y: ['-WF++XF[+++YF++ZF]-', '-XY[F++F]'],
    Z: '--YF++++WF[+ZF++++XF]--XF',
  },
  {
    //3
    theta: 45,
    delta: 6,
    n: 3,
    axiom: 'F',
    // F: 'F[+FF]F[-FF]F'
    F: ['F[+FF]F[-FF]F', 'FF[+FF]F[-FFF]', 'F[+FFF]Z[-FF]F', 'F[+FFF]Z[-FF]F'],
    Z: ['', '-', 'F[ZF]-'],
  },
  {
    //4
    theta: 36,
    delta: 20,
    n: 3,
    axiom: '+WF--XF---YF--ZF',
    F: '',
    W: ['YF++ZF----XF[-YF----WF]++', 'YFXF[-YF----WF]++'],
    X: ['+YF--ZF[---WF--XF]+'],
    Y: ['-WF++XF[+++YF++ZF]-', '--W++F[YF+++ZF]-'],
    Z: ['--YF++++WF[+ZF++++XF]--XF', '-YF++++F-XF'],
  },
  {
    //5
    theta: 20,
    delta: 12,
    n: 3,
    axiom: 'FXFXFX',
    F: '',
    X: ['[FX-FY][-FX-FY-FX][ZZ]-FY-FX+FY+FX', '[FX-FY]-FF+FY+FX'],
    Y: 'FY',
    Z: '-FX-FY-FX',
  },
  {
    //6
    axiom: 'X',
    theta: 24,
    delta: 5,
    n: 4,
    F: ['FF', 'FF', 'XF', '+FXF'],
    X: [
      'F-[[X]+X]+F[+FX]-X',
      'F-[[-X]+X]+[F[+FX]-]FXX',
      'F-[-F[-X]F+X]+F[+FX]-X',
    ],
  },
  {
    // 7
    axiom: 'F',
    theta: 60,
    delta: 5,
    n: 5,
    F: ['FF-[XY]+[XY]', 'FF-[YY]+[Y-XY]'],
    X: ['+FY', 'F+XY', '-F+FXY'],
    Y: ['-X', '-XF-X'],
  } /*
{   //8
    axiom: 'F',
    theta: 30,
    delta: 5,
    n: 5,
    F: ['FF-[FY]+[XY]', 'FF-[FF+Y]+[XY]', 'F-[FY]+[FX+XY]'],
    X: ['+FX--Y', 'X[F--x]-Y', 'X[F-x]-Y--XF'],
    Y: ['XX','-XYX', '-Y-FX']
},*/,
  {
    //8 ...
    axiom: 'F',
    theta: 30,
    delta: 5,
    n: 5,
    F: ['FF-[FY]+[XY]', 'FF-[FF+Y]+[XY]', 'F-[FY]+[F+XY]'],
    X: ['+FX--Y', 'X-Y', 'X[F]-Y--F'],
    Y: ['XX', '-XYX', '-Y-FX'],
  },
  {
    //9
    axiom: 'X+F',
    theta: 45,
    delta: 6,
    n: 4,
    F: ['+X-F', '-XX+F', '+XF+'],
    X: ['-FFXF[X+FF-F+]', '-FF[X+XX]-F', 'FXF[X+[F-]XF+]'],
  },
  {
    //10
    axiom: 'F+F+F+F',
    theta: 90,
    delta: 8,
    n: 2,
    F: [
      'F+F-F-FF+F+F-F',
      'F--FF-F-FF+F+F-F',
      'F--FF-F-F+F+F+F-F',
      'F+F-FF+F-FF+F+F',
    ],
  },
  {
    //11
    axiom: 'F',
    theta: 28,
    delta: 9,
    n: 3,
    F: ['[FF+[+F-F-F]X-[-F+F+F]', '[FF+[+F-FF]-[FX+F+F]', 'F[F[FF]+F]'],
    X: ['X[F-X]', '-X+XF', '[F++]-XF', '+XXF'],
  },
  {
    //12
    theta: 60,
    delta: 10,
    n: 3,
    axiom: '+WF--XF---YF--ZF',
    F: 'FF',
    W: ['YF++ZF----XF[+++]++', 'YF++ZF----XF[-YF----WF]++'],
    X: '+YF--ZF[---WF--XF]+',
    Y: ['-WF++XF[+++YF++ZF]-', '-XY[F++F]'],
    Z: '--YF++++WF[+ZF++++XF]--XF',
  },
  {
    //13
    theta: 45,
    delta: 14,
    n: 3,
    axiom: '[N]++[N]++[N]++[N]++[N]',
    M: ['OF++PF----NF[-OF----MF]++', 'OF++PF-NF[-OF----MF]++'],
    N: '+OF--PF[---MF--NF]+',
    O: ['-MF++NF[+++OF++PF]-', 'M+NF-'],
    P: '--OF++++MF[+PF++++NF]--NF',
    F: ['', 'FF', 'M'],
  },
];

export default arr;
