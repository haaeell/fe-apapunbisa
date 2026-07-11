export function buildFormData(data, formData = new FormData(), parentKey = '') {
  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${formKey}[${index}]`;
        if (item instanceof File) {
          formData.append(arrayKey, item);
        } else if (typeof item === 'object' && item !== null) {
          buildFormData(item, formData, arrayKey);
        } else {
          formData.append(arrayKey, item);
        }
      });
    } else if (typeof value === 'boolean') {
      formData.append(formKey, value ? '1' : '0');
    } else if (typeof value === 'object') {
      buildFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
}
