/*
 * @Author: mulingyuer
 * @Date: 2022-11-05 01:27:56
 * @LastEditTime: 2022-11-05 19:18:51
 * @LastEditors: mulingyuer
 * @Description: 策略模式表单校验
 * @FilePath: \otp2\js\validator.js
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
    this.EventMap = []; //事件列表
    this.supportEvent = ["input", "blur", "change", "focus"];
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

    const manualList = []; //手动校验列表
    for (let i = 0, len = rules.length; i < len; i++) {
      const rule = rules[i];
      const { trigger } = rule;
      const strategyList = this.getStrategyList(rule);

      if (strategyList.length <= 0) continue; //跳过本次

      if (Array.isArray(trigger)) {
        for (let j = 0, jLen = trigger.length; j < jLen; j++) {
          for (let k = 0, kLen = strategyList.length; k < kLen; k++) {
            const strategy = strategyList[k].bind(dom, rule, callback);
            this.bindEvent(dom, trigger[j], strategy);
            //校验列表也得存，用于手动校验
            manualList.push(strategy);
          }
        }
      } else {
        for (let k = 0, kLen = strategyList.length; k < kLen; k++) {
          const strategy = strategyList[k].bind(dom, rule, callback);
          this.bindEvent(dom, trigger, strategy);
          //校验列表也得存，用于手动校验
          manualList.push(strategy);
        }
      }
    }

    //存储到最终校验列表
    this.validateList.push(manualList);
  };
  /** 绑定事件 */
  Validator.prototype.bindEvent = function (dom, eventType, fn) {
    if (!this.isSupportEvent(eventType)) return;
    const eventData = this.getEvent(dom);
    const eventList = eventData.events[eventType];
    let commonValidateFn;
    if (eventList.length <= 0) {
      switch (eventType) {
        case "blur": //失去焦点
        case "change": //值改变
        case "input": //输入
        case "focus": //获取焦点
          commonValidateFn = this.commonValidate.bind(this, eventList);
          eventData.commonValidate[eventType] = commonValidateFn;
          dom.addEventListener([eventType], commonValidateFn);
          break;
        default:
          throw new Error("不支持的事件类型");
      }
    }
    eventList.push(fn);
  };
  /** 获取事件对象 */
  Validator.prototype.getEvent = function (dom) {
    let index = -1;
    for (let i = 0, len = this.EventMap.length; i < len; i++) {
      const item = this.EventMap[i];
      if (item.el === dom) {
        index = i;
        break;
      }
    }
    let eventData;
    if (index === -1) {
      eventData = {
        el: dom,
        events: {
          input: [],
          blur: [],
          change: [],
          focus: [],
        },
        commonValidate: {
          input: null,
          blur: null,
          change: null,
          focus: null,
        },
      };
      this.EventMap.push(eventData);
    } else {
      eventData = this.EventMap[index];
    }

    return eventData;
  };
  /** 判断是否是支持绑定的事件 */
  Validator.prototype.isSupportEvent = function (eventType) {
    const index = this.supportEvent.indexOf(eventType);
    return index !== -1;
  };
  /** 通用的dom校验事件 */
  Validator.prototype.commonValidate = function (eventList) {
    for (let i = 0, len = eventList.length; i < len; i++) {
      const fn = eventList[i];
      const flag = fn();
      if (!flag) break;
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
        let flag = true; //默认是校验通过
        for (let i = 0, len = this.validateList.length; i < len; i++) {
          const validateItem = this.validateList[i];
          for (let j = 0, jLen = validateItem.length; j < jLen; j++) {
            try {
              validateItem[j](true); //魔法，bind绑定了dom和rule
            } catch (error) {
              flag = false;
              break; //跳过本次validateItem校验
            }
          }
        }

        if (flag) {
          return resolve(true);
        }
        return reject(false);
      }.bind(this)
    );
  };
  /** 销毁 */
  Validator.prototype.destroy = function () {
    this.validateList = []; //清空手动校验列表
    //清空事件
    for (let i = 0, len = this.EventMap.length; i < len; i++) {
      const item = this.EventMap[i];
      const dom = item.el;
      const commonValidate = item.commonValidate;
      const eventKeys = Object.keys(commonValidate);
      for (let j = 0, jLen = eventKeys.length; j < jLen; j++) {
        const key = eventKeys[j];
        const fn = commonValidate[key];
        if (fn) {
          dom.removeEventListener(key, fn);
        }
      }
    }
    this.EventMap = []; //清空事件列表
  };

  /** 挂载 */
  global.$Validator = Validator;
})(window);
