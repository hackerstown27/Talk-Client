export const checkValidation = (
    event,
    inputId,
    inputFields,
    proceed = true
) => {
    let updatedInputFields = { ...inputFields };
    let updatedInput = { ...updatedInputFields[inputId] };
    updatedInput.value = event.target.value;

    if (
        inputId === "file" &&
        updatedInput.validationRules.mimeTypes.includes(
            event.target.files[0].type
        )
    ) {
        updatedInput.file = event.target.files[0];
    }

    let isValid = true;

    if (updatedInput.validationRules.minLen) {
        isValid =
            event.target.value.length >= updatedInput.validationRules.minLen &&
            isValid;
    }

    if (updatedInput.validationRules.maxLen) {
        isValid =
            event.target.value.length <= updatedInput.validationRules.maxLen &&
            isValid;
    }

    if (updatedInput.validationRules.isRequired) {
        isValid = event.target.value.length !== 0 && isValid;
    }

    if (updatedInput.validationRules.isEmail) {
        const re = /\S+@\S+\.\S+/;
        isValid = re.test(event.target.value) && isValid;
    }

    if (updatedInput.validationRules.matchTo) {
        isValid =
            updatedInput.value ===
                inputFields[updatedInput.validationRules.matchTo].value &&
            isValid;
    }

    updatedInput.isValid = isValid;
    updatedInput.isTouched = true;

    updatedInputFields[inputId] = updatedInput;

    if (proceed) {
        let proceed = true;

        Object.keys(updatedInputFields).forEach((inputId) => {
            proceed = updatedInputFields[inputId].isValid && proceed;
        });

        return {
            inputFields: updatedInputFields,
            proceed: proceed,
        };
    }

    return updatedInputFields;
};

export const capitalize = (str) => {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const toPhoneFormat = (str) => {
    const phoneNo = ["+91"];
    phoneNo.push(str.slice(0, 3), str.slice(3, 6), str.slice(6));
    return phoneNo.join(" ");
};

export const toDateFormat = (str) => {
    const date = new Date(str).toDateString().slice(4);
    const [month, day, year] = date.split(" ");
    return `${day} ${month} ${year}`;
};

export const handleQuery = (query) => {
    return query.toLocaleLowerCase().trim();
}
