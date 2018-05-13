import toastrModule from 'toastr'

toastrModule.options.closeButton = false
toastrModule.options.timeOut = 2500
toastrModule.options.extendedTimeOut = 5000

export const toastr = toastrModule

export default {
  toastr,
}
