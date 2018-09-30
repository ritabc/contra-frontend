import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "titleCase",
  pure: true
})

export class TitleCasePipe implements PipeTransform {
  transform(input:string) {
    const lowerCaseWords = ["of", "in", "on", "the", "a", "and"]
    let words = input.split('_')
    let array = []
    words.forEach(function(word) {
      if(!(lowerCaseWords.includes(word))) {
        let upperCase = word[0].toUpperCase() + word.slice(1)
        array.push(upperCase)
      } else {
        array.push(word)
      }
    });
    return array.join(" ")
  }
}
