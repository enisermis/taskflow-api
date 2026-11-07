const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in-progress', 'completed'];

function isFilledText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// Tek tek ilk hatada durmak yerine hepsini topluyorum, kullanici tek seferde hepsini gorsun
function checkFields(body, isUpdate) {
  const errors = [];

  // Guncellemede sadece gonderilen alana bakiyorum, eklemede hepsi zorunlu
  const shouldCheck = (field) => !isUpdate || body[field] !== undefined;

  if (shouldCheck('title')) {
    if (!isFilledText(body.title)) {
      errors.push('title zorunlu ve bos olamaz');
    } else if (body.title.trim().length < 3) {
      errors.push('title en az 3 karakter olmali');
    }
  }

  if (shouldCheck('description') && !isFilledText(body.description)) {
    errors.push('description zorunlu ve bos olamaz');
  }

  if (shouldCheck('priority') && !PRIORITIES.includes(body.priority)) {
    errors.push(`priority su degerlerden biri olmali: ${PRIORITIES.join(', ')}`);
  }

  if (shouldCheck('assignee') && !isFilledText(body.assignee)) {
    errors.push('assignee zorunlu ve bos olamaz');
  }

  // status eklemede zorunlu degil, gonderilmezse pending oluyor
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.push(`status su degerlerden biri olmali: ${STATUSES.join(', ')}`);
  }

  return errors;
}

function validate(isUpdate) {
  return (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: 'Istek govdesi JSON nesnesi olmali' });
    }

    const fields = ['title', 'description', 'priority', 'assignee', 'status'];
    if (isUpdate && !fields.some((field) => body[field] !== undefined)) {
      return res.status(400).json({ success: false, message: 'Guncellenecek en az bir alan gonderilmeli' });
    }

    const errors = checkFields(body, isUpdate);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Gecersiz veri', errors });
    }

    next();
  };
}

module.exports = {
  validateCreate: validate(false),
  validateUpdate: validate(true),
  PRIORITIES,
  STATUSES,
};
