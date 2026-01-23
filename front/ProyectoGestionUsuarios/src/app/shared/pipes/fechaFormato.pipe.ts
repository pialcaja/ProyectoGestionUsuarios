import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'fechaFormato'
})
export class FechaFormato implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}-${mes}-${año}`;
  }
}