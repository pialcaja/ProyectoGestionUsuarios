import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({
    providedIn: 'root',
})
export class Alerta {

    success(title: string, text?: string) {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonText: 'Aceptar'
        });
    }

    error(title: string, text?: string) {
        return Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonText: 'Aceptar'
        });
    }

    info(title: string, text?: string) {
        return Swal.fire({
            icon: 'info',
            title,
            text,
            confirmButtonText: 'Aceptar'
        });
    }

    warning(title: string, text?: string) {
        return Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'Aceptar'
        });
    }

    confirm(
        title: string,
        text: string,
        confirmText = 'Si',
        cancelText = 'Cancelar',
        icon: SweetAlertIcon = 'question'
    ) {
        return Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
        });
    }

    loading(text = 'Procesando...') {
        Swal.fire({
            title: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    close() {
        Swal.close();
    }
}