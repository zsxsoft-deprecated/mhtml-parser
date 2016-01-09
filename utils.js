var objectAssignPonyFill = require('object-assign');

function objectAssign() {
	if (Object.assign) {
		return Object.assign.apply(Object.assign, arguments);
	} else {
		return objectAssignPonyFill.apply(objectAssignPonyFill, arguments);
	}
}
module.exports = {
	objectAssign: objectAssign
};
