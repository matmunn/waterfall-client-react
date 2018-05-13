import PropTypes from 'prop-types'

export const TaskValidator = {
  id: PropTypes.number,
  is_absence: PropTypes.bool,
  blocks: PropTypes.arrayOf(PropTypes.number),
  client_id: PropTypes.number,
  description: PropTypes.string,
  completed: PropTypes.bool,
  task_added_during_week: PropTypes.bool
}
