/*
 * @Author: mulingyuer
 * @Date: 2022-11-05 01:27:56
 * @LastEditTime: 2022-11-05 04:12:16
 * @LastEditors: mulingyuer
 * @Description: 策略模式表单校验
 * @FilePath: \CustomValidator\validator.js
 * 怎么可能会有bug！！！
 */
"use strict";

(function (global) {
  /** 获取不同表单元素的值 */
  function getVal(el) {
    switch (el.type) {
      case "checkbox":
        return el.checked;
      case "radio":
        return el.checked;
      default:
        return el.value;
    }
  }
  /** 是否不存在 */
  function isNoExist(val) {
    return val === null || val === undefined || val === "";
  }

  /** 策略对象 */
  const strategies = {
    /**
     * @description: 必填
     * @param {object} rule 规则
     * @param {function} callback 回调
     * @param {boolean} isManual 是否手动触发
     * @Date: 2022-11-05 03:21:27
     * @Author: mulingyuer
     */
    required: function (rule, callback, isManual) {
      try {
        const message = rule.message || "required";
        let value = getVal(this);
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        if (value === "") throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 最小长度 */
    min: function (rule, callback, isManual) {
      try {
        const message = rule.message || `min ${minLength}`;
        let value = getVal(this);
        const minLength = rule.min;
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        if (value.length < minLength) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 最大长度 */
    max: function (rule, callback, isManual) {
      try {
        const message = rule.message || `max ${maxLength}`;
        let value = getVal(this);
        const maxLength = rule.max;
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        if (value.length > maxLength) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 邮箱 */
    email: function (rule, callback, isManual) {
      try {
        const message = rule.message || "email";
        let value = getVal(this);
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(value)) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 年份：YYYY */
    year: function (rule, callback, isManual) {
      try {
        const message = rule.message || "year";
        let value = getVal(this);
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        const reg = /^\d{4}$/;
        if (!reg.test(value)) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 月份：MM */
    month: function (rule, callback, isManual) {
      try {
        const message = rule.message || "month";
        let value = getVal(this);
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        const reg = /^(0?[1-9]|1[0-2])$/;
        if (!reg.test(value)) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
    /** 日期：DD */
    date: function (rule, callback, isManual) {
      try {
        const message = rule.message || "date";
        let value = getVal(this);
        if (isNoExist(value)) throw new Error(message);
        value = value.toString().trim();
        const reg = /^(0?[1-9]|[12][0-9]|3[01])$/;
        if (!reg.test(value)) throw new Error(message);
        typeof callback === "function" && callback(void 0, this);
        return true;
      } catch (error) {
        typeof callback === "function" && callback(error, this);
        if (isManual === true) {
          throw error;
        } else {
          console.warn(error.message);
          return false;
        }
      }
    },
  };
  const strategiesKeys = Object.keys(strategies);

  /** Validator类 */
  function Validator() {
    this.validateList = []; //校验列表
  }
  /**  */
  /**
   * @description: 添加校验
   * @param {element} dom 表单元素
   * @param {array} rules 校验规则 [{ required: true, message: "必填", trigger: "blur" }]
   * @param {function} callback 校验回调(可选)
   * @Date: 2022-11-05 03:19:57
   * @Author: mulingyuer
   */
  Validator.prototype.add = function (dom, rules, callback) {
    if (!Array.isArray(rules)) {
      throw new Error("rules必须是数组");
    }

    const self = this;
    for (let i = 0, len = rules.length; i < len; i++) {
      const rule = rules[i];
      const { trigger } = rule;
      const strategyList = self.getStrategyList(rule);

      if (strategyList.length <= 0) break;

      if (Array.isArray(trigger)) {
        for (let j = 0, jLen = trigger.length; j < jLen; j++) {
          for (let k = 0, kLen = strategyList.length; k < kLen; k++) {
            const strategy = strategyList[k].bind(dom, rule, callback);
            self.bindEvent(dom, trigger[j], strategy);
            //校验列表也得存，用于手动校验
            self.validateList.push(strategy);
          }
        }
      } else {
        for (let k = 0, kLen = strategyList.length; k < kLen; k++) {
          const strategy = strategyList[k].bind(dom, rule, callback);
          self.bindEvent(dom, trigger, strategy);
          //校验列表也得存，用于手动校验
          self.validateList.push(strategy);
        }
      }
    }
  };
  /** 绑定事件 */
  Validator.prototype.bindEvent = function (dom, eventType, fn) {
    switch (eventType) {
      case "blur": //失去焦点
        dom.addEventListener("blur", fn);
        break;
      case "change": //值改变
        dom.addEventListener("change", fn);
        break;
      case "input": //输入
        dom.addEventListener("input", fn);
        break;
      default:
        throw new Error("不支持的事件类型");
    }
  };
  /** 通过rule对象获取策略 */
  Validator.prototype.getStrategyList = function (rule) {
    const keys = Object.keys(rule);
    const effectiveKeys = [];
    const strategyArr = [];

    //筛选有效key
    for (let i = 0, len = keys.length; i < len; i++) {
      const currentKey = keys[i];
      const isEffective = strategiesKeys.some(function (key) {
        return key === currentKey;
      });
      if (isEffective) {
        effectiveKeys.push(currentKey);
      }
    }

    //获取策略
    for (let j = 0, jLen = effectiveKeys.length; j < jLen; j++) {
      const currentKey = effectiveKeys[j];
      strategyArr.push(strategies[currentKey]);
    }

    return strategyArr;
  };
  /** validate手动校验 */
  Validator.prototype.validate = function () {
    return new Promise(
      function (resolve, reject) {
        try {
          for (let i = 0, len = this.validateList.length; i < len; i++) {
            this.validateList[i](true); //魔法，bind绑定了dom和rule
          }
          return resolve(true);
        } catch (error) {
          return reject(error);
        }
      }.bind(this)
    );
  };

  /** 挂载 */
  global.$Validator = Validator;
})(window);
