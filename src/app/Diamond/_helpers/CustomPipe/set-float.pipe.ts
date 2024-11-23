import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setFloat'
})
export class SetFloatPipe implements PipeTransform {

  // transform(e: number, flonum: any): unknown {
  //   console.log(typeof e, e, typeof flonum, flonum);

  //   return parseFloat(this[e]).toFixed(flonum)
  // }
  transform(e: any, flonum: number): unknown {
    // console.log("before: ", typeof e, e, "flonum: ", flonum);

    e = parseFloat(e);
    // console.log("after: ", typeof e, e, "flonum: ", flonum);
    return e.toFixed(flonum);
  }

  // SETFLOAT(e: any, flonum: any) {
  //   return parseFloat(this[e]).toFixed(flonum)
  // }

}
