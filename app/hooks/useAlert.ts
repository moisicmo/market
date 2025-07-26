import Swal from 'sweetalert2';

export const useAlertStore = () => {

   const showLoading = (title: string = 'Cargando...') => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const showSuccess = (message: string) => {
    return Swal.fire(message, '', 'success');
  };

  const showWarning = () => {
    return Swal.fire({
      title: '¿Estas seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!',
      cancelButtonText: '¡No, cancelar!',
    });
  };

  const showError = (title: string, message: string) => {
    Swal.fire(title, message, 'error');
  };

  const showDesition = (title: string, content: string, confirmButtonText: string) => {
    return Swal.fire({
      title: title,
      text: content,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: '¡No, cancelar!',
    });
  }

  const swalClose = () => {
    Swal.close();
  };

  return {
    showLoading,
    showSuccess,
    showWarning,
    showError,
    showDesition,
    swalClose,
  };
};
