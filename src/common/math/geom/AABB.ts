declare global {
    type AABB2 = _.AABB2
    const AABB2: typeof _.AABB2

    type AABB3 = _.AABB3
    const AABB3: typeof _.AABB3
}

namespace _ {
    export class AABB2 {
        constructor(public xb: number, public xe: number, public yb: number, public ye: number) {}
    }

    export class AABB3 {
        constructor(
            public xb: number,
            public xe: number,
            public yb: number,
            public ye: number,
            public zb: number,
            public ze: number
        ) {}
    }
}

globalify(_)
export {}
