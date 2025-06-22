const allowedFileTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

const MultipartTask = async (req, reply) => {
  const parts = req.parts();
  const formData = {};
  let filePart = null;

  for await (const part of parts) {
    if (part.file && part.fieldname === 'file') {
      filePart = part;
    } else if (!part.file) {
      // Handle multiple values like 'assignedTo'
      if (formData[part.fieldname]) {
        if (!Array.isArray(formData[part.fieldname])) {
          formData[part.fieldname] = [formData[part.fieldname]];
        }
        formData[part.fieldname].push(part.value);
      } else {
        formData[part.fieldname] = part.value;
      }
    }
  }

  // ✅ Validate required fields
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!formData.description || formData.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters.';
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else {
    const dueDate = new Date(formData.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid date format.';
    }
  }

  const assigned = formData.assignedTo;
  if (!assigned || (Array.isArray(assigned) && assigned.length === 0)) {
    errors.assignedTo = 'At least one assignee is required.';
  }

  if (Object.keys(errors).length > 0) {
    return reply.code(400).send({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // ✅ Validate file
  if (filePart && !allowedFileTypes.includes(filePart.mimetype)) {
    return reply.code(400).send({
      success: false,
      message: 'Invalid file type. Allowed: PDF, PNG, JPEG, JPG, WEBP'
    });
  }

  // ✅ Inject parsed values into Fastify req
  req.body = formData;
  if (filePart) {
    req.file = filePart;
  }
};

// ✅ Export only the validations actually being used
module.exports = {
  MultipartTask
};
