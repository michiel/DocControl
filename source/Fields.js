// Generated by CoffeeScript 1.3.3
(function() {
  var BooleanField, CharField, ChoiceField, EmailField, Field, FloatField, IntegerField, NullBooleanField, RegexField, fields, utils, validators,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof exports !== "undefined" && exports !== null) {
    utils = require("./utils");
    validators = require("./Validators");
  } else if (typeof window !== "undefined" && window !== null) {
    utils = window.utils;
    validators = window.validators;
  }

  Field = (function() {

    Field.prototype.clean = void 0;

    Field.prototype.errors = [];

    Field.prototype.validators = [];

    Field.prototype.errorMessages = {
      required: utils._i('This field is required.')
    };

    Field.prototype.handlers = {};

    Field.prototype.parent = void 0;

    Field.prototype.defaults = {
      name: void 0,
      required: true,
      value: void 0
    };

    function Field(opts) {
      var _ref, _ref1;
      this.defaults = this._walkProto("defaults");
      if ((_ref = this.opts) == null) {
        this.opts = {};
      }
      this.opts = utils.mixin(utils.clone(this.defaults), opts);
      _ref1 = this.opts, this.name = _ref1.name, this.required = _ref1.required, this.parent = _ref1.parent;
      this.errorMessages = this._walkProto("errorMessages");
      this.handlers = this._walkProto("handlers");
      this.validators = utils.cloneArray(this.validators);
      this.setValue(this.opts.value);
    }

    Field.prototype._walkProto = function(attr) {
      var sup;
      sup = this.constructor.__super__;
      if (sup != null) {
        return utils.mixin(utils.clone(sup._walkProto(attr)), this[attr]);
      } else {
        return this[attr];
      }
    };

    Field.prototype.getErrors = function() {
      if (this.errors.length) {
        return this.errors;
      } else {
        return null;
      }
    };

    Field.prototype.toJavascript = function(value) {
      return value;
    };

    Field.prototype._valid = false;

    Field.prototype._hasChanged = true;

    Field.prototype.validate = function(value) {
      if (validators.isEmpty(value) && this.required) {
        this.errors.push(this.errorMessages.required);
      }
      return value;
    };

    Field.prototype.runValidators = function(value) {
      var message, v, _i, _len, _ref;
      if (validators.isEmpty(value)) {
        return;
      }
      _ref = this.validators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        try {
          v.validate(value);
        } catch (e) {
          if (e.code && e.code in this.errorMessages) {
            message = this.errorMessages[e.code];
            if (e.params) {
              utils.interpolate(message, e.params);
            }
            this.errors.push(message);
          } else {
            this.errors.push(e.message);
          }
        }
      }
      return value;
    };

    Field.prototype.isValid = function(opts) {
      var oldErrors, valid, value;
      if (!this._hasChanged) {
        return this._valid;
      }
      oldErrors = utils.clone(this.errors);
      this.errors = [];
      value = this.getValue();
      value = this.toJavascript(value);
      if (!Boolean(this.errors.length)) {
        value = this.validate(value);
      }
      if (!Boolean(this.errors.length)) {
        value = this.runValidators(value);
      }
      valid = !Boolean(this.errors.length);
      this.clean = valid ? value : void 0;
      if (valid !== this._valid || !valid && !utils.isEqual(oldErrors, this.errors)) {
        this.emit("validChanged", {
          valid: valid,
          errors: this.errors
        });
        this._valid = valid;
      }
      this._hasChanged = false;
      return valid;
    };

    Field.prototype.getClean = function(opts) {
      var valid;
      valid = this.isValid(opts);
      if (!valid) {
        throw this.errors;
      }
      return this.clean;
    };

    Field.prototype.toJSON = function(opts) {
      return this.getClean(opts);
    };

    Field.prototype.setRequired = function(val) {
      if (val !== this.required) {
        this._hasChanged = true;
        this.emit("requiredChanged", val);
        return this.required = val;
      }
    };

    Field.prototype.setValue = function(val, opts) {
      if (val !== this.value) {
        this._hasChanged = true;
        this.emit("valueChanged", {
          value: val,
          original: this.value
        });
        return this.value = val;
      }
    };

    Field.prototype.getValue = function() {
      return this.value;
    };

    Field.prototype.getPath = function() {
      if (this.parent) {
        return this.parent.getPath(this);
      } else {
        return [];
      }
    };

    Field.prototype.getField = function(path) {
      if (path.length > 0) {
        return void 0;
      } else {
        return this;
      }
    };

    Field.prototype.emit = function(eventName, inEvent) {
      if (inEvent == null) {
        inEvent = {};
      }
      inEvent.originator = this;
      return this.bubble(eventName, null, inEvent);
    };

    Field.prototype.bubble = function(eventName, inSender, inEvent) {
      var handler;
      handler = this.handlers[eventName] || this.handlers["*"];
      handler = handler instanceof Function ? handler : this[handler];
      if ((!handler || !handler.apply(this, [inSender, inEvent])) && this.parent) {
        return this.parent.bubble(eventName, this, inEvent);
      }
    };

    return Field;

  })();

  CharField = (function(_super) {

    __extends(CharField, _super);

    CharField.prototype.maxLength = void 0;

    CharField.prototype.minLength = void 0;

    function CharField(opts) {
      var _ref;
      CharField.__super__.constructor.call(this, opts);
      _ref = this.opts, this.maxLength = _ref.maxLength, this.minLength = _ref.minLength;
      if (this.maxLength != null) {
        this.validators.push(new validators.MaxLengthValidator(this.maxLength));
      }
      if (this.minLength != null) {
        this.validators.push(new validators.MinLengthValidator(this.minLength));
      }
    }

    CharField.prototype.toJavascript = function(value) {
      value = validators.isEmpty(value) ? "" : value;
      return value;
    };

    return CharField;

  })(Field);

  IntegerField = (function(_super) {

    __extends(IntegerField, _super);

    IntegerField.prototype.maxValue = void 0;

    IntegerField.prototype.minValue = void 0;

    IntegerField.prototype.errorMessages = {
      invalid: utils._i('Enter a whole number.')
    };

    function IntegerField(opts) {
      var _ref;
      IntegerField.__super__.constructor.call(this, opts);
      _ref = this.opts, this.maxValue = _ref.maxValue, this.minValue = _ref.minValue;
      if (this.maxValue != null) {
        this.validators.push(new validators.MaxValueValidator(this.maxValue));
      }
      if (this.minValue != null) {
        this.validators.push(new validators.MinValueValidator(this.minValue));
      }
    }

    IntegerField.prototype.parseFn = parseInt;

    IntegerField.prototype.regex = /^-?\d*$/;

    IntegerField.prototype.toJavascript = function(value) {
      if (typeof value === "string" && !value.match(this.regex)) {
        this.errors.push(this.errorMessages['invalid']);
        return;
      }
      value = validators.isEmpty(value) ? void 0 : this.parseFn(value, 10);
      if ((value != null) && isNaN(value)) {
        this.errors.push(this.errorMessages['invalid']);
      }
      return value;
    };

    return IntegerField;

  })(Field);

  FloatField = (function(_super) {

    __extends(FloatField, _super);

    FloatField.prototype.maxDecimals = void 0;

    FloatField.prototype.minDecimals = void 0;

    FloatField.prototype.maxDigits = void 0;

    FloatField.prototype.errorMessages = {
      invalid: utils._i('Enter a number.')
    };

    function FloatField(opts) {
      var _ref;
      FloatField.__super__.constructor.call(this, opts);
      _ref = this.opts, this.maxDecimals = _ref.maxDecimals, this.minDecimals = _ref.minDecimals, this.maxDigits = _ref.maxDigits;
      if (this.maxDecimals != null) {
        this.validators.push(new validators.MaxDecimalPlacesValidator(this.maxDecimals));
      }
      if (this.minDecimals != null) {
        this.validators.push(new validators.MinDecimalPlacesValidator(this.minDecimals));
      }
      if (this.maxDigits != null) {
        this.validators.push(new validators.MaxDigitsValidator(this.maxDigits));
      }
    }

    FloatField.prototype.parseFn = parseFloat;

    FloatField.prototype.regex = /^\d*\.?\d*$/;

    return FloatField;

  })(IntegerField);

  RegexField = (function(_super) {

    __extends(RegexField, _super);

    RegexField.prototype.regex = void 0;

    RegexField.prototype.errorMessage = void 0;

    function RegexField(opts) {
      this.inherited(arguments);
      this.validators.push(new validators.RegexValidator(this.regex));
      if (this.errorMessage) {
        this.errorMessages.invalid = this.errorMessage;
      }
    }

    return RegexField;

  })(Field);

  EmailField = (function(_super) {

    __extends(EmailField, _super);

    function EmailField() {
      return EmailField.__super__.constructor.apply(this, arguments);
    }

    EmailField.prototype.widget = "widgets.EmailWidget";

    EmailField.prototype.validators = [new validators.EmailValidator()];

    return EmailField;

  })(RegexField);

  BooleanField = (function(_super) {

    __extends(BooleanField, _super);

    function BooleanField() {
      return BooleanField.__super__.constructor.apply(this, arguments);
    }

    BooleanField.prototype.widget = "widgets.CheckboxWidget";

    BooleanField.prototype.toJavascript = function(value) {
      if (typeof value === "string" && includes(["false", "0"], value.toLowerCase())) {
        value = false;
      } else {
        value = Boolean(value);
      }
      if (!value && this.required) {
        this.errors.push(this.errorMessages.required);
      }
      return value;
    };

    return BooleanField;

  })(Field);

  NullBooleanField = (function(_super) {

    __extends(NullBooleanField, _super);

    function NullBooleanField() {
      return NullBooleanField.__super__.constructor.apply(this, arguments);
    }

    NullBooleanField.prototype.toJavascript = function(value) {
      if (includes([true, "True", "1"], value)) {
        value = true;
      } else if (includes([false, "False", "0"], value)) {
        value = false;
      } else {
        value = null;
      }
      return value;
    };

    NullBooleanField.prototype.validate = function(value) {
      return value;
    };

    return NullBooleanField;

  })(BooleanField);

  ChoiceField = (function(_super) {

    __extends(ChoiceField, _super);

    ChoiceField.prototype.widget = "widgets.ChoiceWidget";

    ChoiceField.prototype.choices = [];

    ChoiceField.prototype.errorMessages = {
      invalidChoice: utils._i('Select a valid choice. %(value)s is not one of the available choices.')
    };

    function ChoiceField(opts) {
      ChoiceField.__super__.constructor.call(this, opts);
      this.choices = this.opts.choices;
      this.setChoices(utils.cloneArray(this.choices));
    }

    ChoiceField.prototype.setChoices = function(val) {
      var choices, iterChoices;
      choices = {};
      iterChoices = function(x) {
        if ((x[1] instanceof Array)(utils.forEach(x[1], iterChoices))) {

        } else {
          return choices[x[0]] = x[1];
        }
      };
      utils.forEach(this.choices, iterChoices);
      return this.choicesIndex = choices;
    };

    ChoiceField.prototype.toJavascript = function(value) {
      value = validators.isEmpty(value) ? "" : value;
      return value;
    };

    ChoiceField.prototype.validate = function(value) {
      var message;
      value = ChoiceField.__super__.validate.call(this, value);
      if (value && !this.validValue(value)) {
        message = this.errorMessages.invalidChoice;
        this.errors = [interpolate(message, [value])];
      }
      return value;
    };

    ChoiceField.prototype.validValue = function(val) {
      return val in this.choicesIndex;
    };

    ChoiceField.prototype.getDisplay = function() {
      return this.choices[this.getClean()];
    };

    return ChoiceField;

  })(Field);

  fields = {
    Field: Field,
    CharField: CharField,
    IntegerField: IntegerField,
    FloatField: FloatField,
    RegexField: RegexField,
    EmailField: EmailField,
    BooleanField: BooleanField,
    NullBooleanField: NullBooleanField,
    ChoiceField: ChoiceField
  };

  if (typeof window !== "undefined" && window !== null) {
    window.fields = fields;
  } else if (typeof exports !== "undefined" && exports !== null) {
    module.exports = fields;
  }

}).call(this);
