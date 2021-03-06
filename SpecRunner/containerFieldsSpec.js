// Generated by CoffeeScript 1.4.0
var fields, utils;

if (typeof exports !== "undefined" && exports !== null) {
  fields = require("../coffee/Fields");
  utils = require("../coffee/utils");
}

describe("ListField", function() {
  beforeEach(function() {
    this.subSchema = {
      field: "CharField",
      name: "sub",
      minLength: 5
    };
    this.vals = ["hello", "world"];
    return this.field = new fields.ListField({
      name: "test",
      schema: this.subSchema,
      value: this.vals
    });
  });
  it("should store its schema in @schema", function() {
    return expect(this.field.schema).toEqual(this.subSchema);
  });
  it("should create as many subfields as there are vals in the values array; subfield should have proper value and parent should be ListField", function() {
    expect(this.field.getFields().length).toBe(2);
    expect(this.field.getFields()[0].getValue()).toEqual("hello");
    expect(this.field.getFields()[1].getValue()).toEqual("world");
    return expect(this.field.getFields()[0].parent).toBe(this.field);
  });
  it("should generate path for subfield from index", function() {
    expect(this.field.getFields()[0].getPath()).toEqual([0]);
    return expect(this.field.getFields()[1].getPath()).toEqual([1]);
  });
  it("should return getValue() as a list of subfield values", function() {
    return expect(this.field.getValue()).toEqual(["hello", "world"]);
  });
  it("should set values (and emit valueChanged event if changed) when setValue called", function() {
    this.field.listeners.onValueChanged = function(inSender, inEvent) {};
    spyOn(this.field.listeners, "onValueChanged");
    this.field.setValue(this.vals);
    this.field.setValue(['the', 'quick', 'brown', 'fox']);
    expect(this.field.getFields().length).toBe(4);
    return expect(this.field.listeners.onValueChanged.calls.length).toBe(5);
  });
  it("should throw an error if setValue called with anything other than an Array of values", function() {
    var _this = this;
    expect(function() {
      return _this.field.setValue('hello');
    }).toThrow();
    return expect(function() {
      return _this.field.setValue({
        a: 'hello'
      });
    }).toThrow();
  });
  it("should be able to get immediate child by index", function() {
    return expect(this.field._getField(0).getValue()).toBe("hello");
  });
  it("should create a new child with the given value when addField is called", function() {
    this.field.addField("three");
    return expect(this.field.getValue()).toEqual(["hello", "world", "three"]);
  });
  it("should only create a new child with the given value when addField is called with an index that is exactly equal to the current number of fields", function() {
    this.field.addField("three", 1);
    expect(this.field.getValue()).toEqual(["hello", "world"]);
    this.field.addField("three", 3);
    expect(this.field.getValue()).toEqual(["hello", "world"]);
    this.field.addField("three", 2);
    return expect(this.field.getValue()).toEqual(["hello", "world", "three"]);
  });
  it("should getValue of listField when path is empty", function() {
    expect(this.field.getValue({
      path: ""
    })).toEqual(this.field.getValue());
    return expect(this.field.getValue({
      path: []
    })).toEqual(this.field.getValue());
  });
  it("should return the proper value when getValue() called, even when it hasn't finished creating all subfields", function() {
    var _this = this;
    this.field = new fields.ListField({
      name: "test",
      schema: this.subSchema
    });
    this.field.listeners.onFieldAdd = function(inSender, inEvent) {
      if (inSender) {
        return expect(inEvent.originator.parent.getValue()).toEqual(_this.vals);
      }
    };
    return this.field.setValue(this.vals);
  });
  return xit("should return an empty list if value passed is undefined; it should return null if value passed is null", function() {
    this.field = new fields.ListField({
      name: "test",
      schema: this.subSchema
    });
    expect(this.field.getValue()).toEqual([]);
    this.field = new fields.ListField({
      name: "test",
      schema: this.subSchema,
      value: null
    });
    return expect(this.field.getValue()).toEqual(null);
  });
});

describe("ContainerField", function() {
  beforeEach(function() {
    this.subSchema = [
      {
        field: "CharField",
        name: "sub",
        minLength: 5
      }, {
        field: "IntegerField",
        name: "sub2",
        minValue: 0
      }
    ];
    this.vals = {
      sub: "hello world",
      sub2: 5
    };
    return this.field = new fields.ContainerField({
      name: "test",
      schema: this.subSchema,
      value: this.vals
    });
  });
  it("should immediately create subfields from schema with field as parent, and appropriate value", function() {
    expect(this.field.schema).toEqual(this.subSchema);
    expect(this.field.getFields()[0] instanceof fields.CharField).toBe(true);
    expect(this.field.getFields()[1] instanceof fields.IntegerField).toBe(true);
    expect(this.field.getFields()[0].getValue()).toEqual("hello world");
    expect(this.field.getFields()[1].getValue()).toEqual(5);
    return expect(this.field.getFields()[0].parent).toBe(this.field);
  });
  it("should generate path for subfield from name", function() {
    expect(this.field.getFields()[0].getPath()).toEqual(["sub"]);
    return expect(this.field.getFields()[1].getPath()).toEqual(["sub2"]);
  });
  it("should return getValue() as a hash of subfield values", function() {
    return expect(this.field.getValue()).toEqual({
      sub: "hello world",
      sub2: 5
    });
  });
  it("should be able to get immediate child by name", function() {
    return expect(this.field._getField("sub").getValue()).toBe("hello world");
  });
  it("should throw an error if setValue called with anything other than a hash of values", function() {
    var _this = this;
    expect(function() {
      return _this.field.setValue('hello');
    }).toThrow();
    return expect(function() {
      return _this.field.setValue(['hello']);
    }).toThrow();
  });
  it("should getValue of Containerfield when path is empty", function() {
    expect(this.field.getValue({
      path: ""
    })).toEqual(this.field.getValue());
    return expect(this.field.getValue({
      path: []
    })).toEqual(this.field.getValue());
  });
  return it("should call setValue(undefined) on each subfield when called with setValue(undefined)", function() {
    expect(this.field.getValue()).toEqual({
      sub: "hello world",
      sub2: 5
    });
    this.field.setValue();
    return expect(this.field.getValue()).toEqual({
      sub: void 0,
      sub2: void 0
    });
  });
});

describe("HashField", function() {
  beforeEach(function() {
    this.subSchema = {
      field: "CharField",
      name: "sub",
      minLength: 5
    };
    this.vals = {
      hello: "world",
      goodnight: "moon"
    };
    return this.field = new fields.HashField({
      name: "test",
      schema: this.subSchema,
      value: this.vals
    });
  });
  it("should store its schema in @schema", function() {
    return expect(this.field.schema).toEqual(this.subSchema);
  });
  it("should create as many subfields as there are vals in the values object; subfield should have proper value and parent should be HashField", function() {
    expect(this.field.getFields()[0].getValue()).toEqual("world");
    expect(this.field.getFields()[1].getValue()).toEqual("moon");
    return expect(this.field.getFields()[0].parent).toBe(this.field);
  });
  it("should generate path for subfield from key", function() {
    expect(this.field.getFields()[0].getPath()).toEqual(["hello"]);
    return expect(this.field.getFields()[1].getPath()).toEqual(["goodnight"]);
  });
  it("should return getValue() as a hash of subfield values", function() {
    return expect(this.field.getValue()).toEqual({
      hello: "world",
      goodnight: "moon"
    });
  });
  it("should set values (and emit valueChanged event if changed) when setValue called", function() {
    var vals2;
    this.field.listeners.onValueChanged = function(inSender, inEvent) {};
    spyOn(this.field.listeners, "onValueChanged");
    this.field.setValue(this.vals);
    vals2 = {
      the: "cat",
      "in": "the hat"
    };
    this.field.setValue(vals2);
    expect(this.field.getFields().length).toBe(2);
    expect(this.field.getValue()).toEqual(vals2);
    return expect(this.field.listeners.onValueChanged.calls.length).toBe(3);
  });
  it("should throw an error if setValue called with anything other than a hash of values", function() {
    var _this = this;
    expect(function() {
      return _this.field.setValue('hello');
    }).toThrow();
    return expect(function() {
      return _this.field.setValue(['hello']);
    }).toThrow();
  });
  it("should be able to get immediate child by index", function() {
    return expect(this.field._getField("hello").getValue()).toBe("world");
  });
  it("should create a new child with the given value at the specified key when addField is called", function() {
    this.field.addField("four", "score");
    return expect(this.field.getValue()).toEqual({
      hello: "world",
      goodnight: "moon",
      four: "score"
    });
  });
  it("should return the proper value when getValue() called, even when it hasn't finished creating all subfields", function() {
    var _this = this;
    this.field = new fields.HashField({
      name: "test",
      schema: this.subSchema
    });
    this.field.listeners.onFieldAdd = function(inSender, inEvent) {
      if (inSender) {
        return expect(inEvent.originator.parent.getValue()).toEqual(_this.vals);
      }
    };
    return this.field.setValue(this.vals);
  });
  return xit("should return an empty list if value passed is undefined; it should return null if value passed is null", function() {
    this.field = new fields.HashField({
      name: "test",
      schema: this.subSchema
    });
    expect(this.field.getValue()).toEqual({});
    this.field = new fields.HashField({
      name: "test",
      schema: this.subSchema,
      value: null
    });
    return expect(this.field.getValue()).toEqual(null);
  });
});

describe("ListField Validation", function() {
  beforeEach(function() {
    this.subSchema = {
      field: "CharField",
      name: "sub",
      minLength: 5
    };
    this.vals = ["hello", "moon"];
    return this.field = new fields.ListField({
      name: "test",
      schema: this.subSchema,
      value: this.vals
    });
  });
  it("should perform revalidation if subfield value has changed", function() {
    this.field.isValid();
    spyOn(this.field, "validate");
    this.field.getFields()[1].setValue("world");
    this.field.isValid();
    return expect(this.field.validate).toHaveBeenCalled();
  });
  it("should perform revalidation if subfield required has changed", function() {
    this.field.setValue('world', {
      path: "1"
    });
    this.field.isValid();
    spyOn(this.field, "validate");
    expect(this.field.getFields()[1].required).toBe(true);
    this.field.getFields()[1].setRequired(false);
    this.field.isValid();
    return expect(this.field.validate).toHaveBeenCalled();
  });
  it("should be valid only if children are valid", function() {
    expect(this.field.isValid()).toBe(false);
    this.field.getFields()[1].setValue('world');
    expect(this.field.isValid()).toBe(true);
    this.field.getFields()[1].setValue('worl');
    return expect(this.field.isValid()).toBe(false);
  });
  return it("should validate every subfield", function() {
    this.field.setValue("hi", "0");
    this.field.isValid();
    expect(this.field.getField('0').errors.length).toBe(1);
    return expect(this.field.getField('1').errors.length).toBe(1);
  });
});

describe("ContainerField Validation", function() {
  beforeEach(function() {
    this.subSchema = [
      {
        field: "CharField",
        name: "sub",
        minLength: 5
      }, {
        field: "IntegerField",
        name: "sub2",
        minValue: 0
      }
    ];
    this.vals = {
      sub: "hello world",
      sub2: -5
    };
    return this.field = new fields.ContainerField({
      name: "test",
      schema: this.subSchema,
      value: this.vals
    });
  });
  it("should perform revalidation if value has changed", function() {
    this.field.isValid();
    spyOn(this.field, "validate");
    this.field.getFields()[1].setValue(5);
    this.field.isValid();
    return expect(this.field.validate).toHaveBeenCalled();
  });
  return it("should be valid only if children are valid", function() {
    expect(this.field.getFields()[1].isValid()).toBe(false);
    expect(this.field.isValid()).toBe(false);
    this.field.getFields()[1].setValue(5);
    expect(this.field.isValid()).toBe(true);
    this.field.getFields()[1].setValue(-5);
    return expect(this.field.isValid()).toBe(false);
  });
});

describe("field traversal", function() {
  beforeEach(function() {
    this.schema = [
      {
        field: "ListField",
        name: "firstList",
        schema: {
          field: "ContainerField",
          name: "secondContainer",
          schema: [
            {
              field: "ListField",
              name: "secondList",
              schema: {
                field: "CharField",
                name: "text",
                minLength: 5
              }
            }
          ]
        }
      }
    ];
    this.vals = {
      firstList: [
        {
          secondList: ["hello", "moon"]
        }
      ]
    };
    return this.field = new fields.ContainerField({
      name: "firstContainer",
      schema: this.schema,
      value: this.vals
    });
  });
  it("should recursively input values and create subfield", function() {
    return expect(this.field.getValue()).toEqual({
      firstList: [
        {
          secondList: ['hello', 'moon']
        }
      ]
    });
  });
  it("should return itself if no path given, or path is null/undefined", function() {
    expect(this.field.getField()).toBe(this.field);
    return expect(this.field.getField("")).toBe(this.field);
  });
  it("should return a subfield given a string path", function() {
    return expect(this.field.getField("firstList.0.secondList.1").getValue()).toBe("moon");
  });
  it("should return a subfield given an array path", function() {
    return expect(this.field.getField(["firstList", 0, "secondList", 1]).getValue()).toBe("moon");
  });
  it("should return undefined if getField is passed an invalid path", function() {
    expect(this.field.getField("noField")).toBe(void 0);
    return expect(this.field.getField("firstList.22")).toBe(void 0);
  });
  it("should get isValid for specific field if passed opts.path", function() {
    return expect(this.field.isValid({
      path: "firstList.0.secondList.1"
    })).toBe(false);
  });
  it("should setValue of specific field, and getValue and json for specific field if passed opts.path", function() {
    this.field.setValue("world", {
      path: "firstList.0.secondList.1"
    });
    expect(this.field.getValue({
      path: "firstList.0.secondList"
    })).toEqual(["hello", "world"]);
    expect(this.field.toJSON({
      path: "firstList.0.secondList"
    })).toEqual(["hello", "world"]);
    return expect(this.field.getClean({
      path: "firstList.0.secondList"
    })).toEqual(["hello", "world"]);
  });
  it("should get errors for specific field if passed opts.path", function() {
    return expect(this.field.getErrors({
      path: "firstList.0.secondList.1"
    })).toEqual(['Ensure this value has at least 5 characters (it has 4).']);
  });
  it("should convert opts arguments that are strings to an opts object with a path equal to the string", function() {
    this.field.setValue("world", "firstList.0.secondList.1");
    return expect(this.field.getValue("firstList.0.secondList")).toEqual(["hello", "world"]);
  });
  return it("should convert opts arguments that are an array to an opts object with a path equal to the array", function() {
    this.field.setValue("world", ["firstList", 0, "secondList", 1]);
    return expect(this.field.getValue(["firstList", 0, "secondList"])).toEqual(["hello", "world"]);
  });
});
