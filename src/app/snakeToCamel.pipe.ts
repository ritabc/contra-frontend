import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "snakeToCamel",
  pure: true
})

export class SnakeToCamelPipe implements PipeTransform {
  transform(snakeString:string) {
    let words = snakeString.split('_')
    let camelCaseString:string = ''
    words.forEach(function(word, index) {
      if (index === 0) {
        camelCaseString += word
      } else {
        camelCaseString += word.charAt(0).toUpperCase();
        camelCaseString += word.substr(1);
      }
    });
    return camelCaseString;
  }
}
