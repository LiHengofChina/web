 
(function (root, _factory) {
  if (typeof exports === 'object') {
    _factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], _factory);
  } else {
    _factory(root);
  }
} (this, function (exports) {
   
  function GuideJs(obj) {
    this._targetElement = obj;
    this._introItems = [];

    this._options = {
      doneLabel: '去看看',
      tooltipPosition: 'bottom',
      tooltipClass: '',
      highlightClass: '',
      exitOnEsc: true,
      exitOnOverlayClick: true,
      showStepNumbers: true,
      keyboardNavigation: true,
      scrollToElement: true,
      overlayOpacity: 0.8,
      scrollPadding: 30
    };
  }
  function _introForElement(targetElm) {
    var introItems = [],
        self = this;
      var allIntroSteps = targetElm.querySelectorAll('*[data-lhjs]');
      if (allIntroSteps.length < 1) {
        return false;
      }
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
        if (currentElement.style.display == 'none') {
          continue;
        }
        var step = parseInt(currentElement.getAttribute('data-step'), 10);
 
      }
      var nextStep = 0;
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
        if (currentElement.getAttribute('data-step') == null) {

          while (true) {
            if (typeof introItems[nextStep] == 'undefined') {
              break;
            } else {
              nextStep++;
            }
          }

          introItems[nextStep] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-lhjs'),
            
            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
            highlightClass: currentElement.getAttribute('data-highlightClass'),
            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
          };
        }
      }
    var tempIntroItems = [];
	
    for (var z = 0; z < introItems.length; z++) {
      introItems[z] && tempIntroItems.push(introItems[z]);  
    }
    introItems = tempIntroItems;
 
    self._introItems = introItems;
    if(_addOverlayLayer.call(self, targetElm)) {
	 
      _nextStep.call(self);
      var  nextStepButton = targetElm.querySelector('.lhjs-nextbutton');
      self._onKeyDown = function(e) {
		if (e.keyCode === 13) {
          var target = e.target || e.srcElement;
          _nextStep.call(self);
          if(e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };
      if (window.addEventListener) {
        if (this._options.keyboardNavigation) {
          window.addEventListener('keydown', self._onKeyDown, true);
        }
        window.addEventListener('resize', self._onResize, true);
      } else if (document.attachEvent) { //IE

        if (this._options.keyboardNavigation) {
          document.attachEvent('onkeydown', self._onKeyDown);
        }
        document.attachEvent('onresize', self._onResize);
      }
    }
    return false;
  }
  function _nextStep() {  
    this._direction = 'forward';
    if (typeof (this._currentStep) === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    if ((this._introItems.length) <= this._currentStep) {
      if (typeof (this._introCompleteCallback) === 'function') {
        this._introCompleteCallback.call(this);
      }
      _exitIntro.call(this, this._targetElement);
      return;
    }

    var nextStep = this._introItems[this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   *  退出提示页面
   */
  function _exitIntro(targetElement) {
	  
    //remove overlay layers from the page
    var overlayLayers = targetElement.querySelectorAll('.lhjs-overlay');

    if (overlayLayers && overlayLayers.length > 0) {
      for (var i = overlayLayers.length - 1; i >= 0; i--) {
        //for fade-out animation
        var overlayLayer = overlayLayers[i];
        overlayLayer.style.opacity = 0;
        setTimeout(function () {
          if (overlayLayer.parentNode) {
            overlayLayer.parentNode.removeChild(overlayLayer);
          }
        }, 500);
      };
    }

    //remove all helper layers
    var helperLayer = targetElement.querySelector('.lhjs-helperLayer');
    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }

    var referenceLayer = targetElement.querySelector('.lhjs-tooltipReferenceLayer');
    if (referenceLayer) {
      referenceLayer.parentNode.removeChild(referenceLayer);
    }
 

    //remove intro floating element
    var floatingElement = document.querySelector('.introjsFloatingElement');
    if (floatingElement) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    _removeShowElement();

 
    //clean listeners
    if (window.removeEventListener) {
      window.removeEventListener('keydown', this._onKeyDown, true);
    } else if (document.detachEvent) { //IE
      document.detachEvent('onkeydown', this._onKeyDown);
    }

    //check if any callback is defined
    if (this._introExitCallback != undefined) {
      this._introExitCallback.call(self);
    }

    //set the step to zero
    this._currentStep = undefined;
  }

  /**
   *渲染提示框页面
   */
  function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer, hintMode) {
	  
    var tooltipCssClass = '',
        currentStepObj,
        tooltipOffset,
        targetOffset,
        windowSize,
        currentTooltipPosition;

    hintMode = hintMode || false;

    //reset the old style
    tooltipLayer.style.top        = null;
    tooltipLayer.style.right      = null;
    tooltipLayer.style.bottom     = null;
    tooltipLayer.style.left       = null;
    tooltipLayer.style.marginLeft = null;
    tooltipLayer.style.marginTop  = null;

    arrowLayer.style.display = 'inherit';

    if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
      helperNumberLayer.style.top  = null;
      helperNumberLayer.style.left = null;
    }

    //prevent error when `this._currentStep` is undefined
    if (!this._introItems[this._currentStep]) return;

    //if we have a custom css class for each step
    currentStepObj = this._introItems[this._currentStep];
    if (typeof (currentStepObj.tooltipClass) === 'string') {
      tooltipCssClass = currentStepObj.tooltipClass;
    } else {
      tooltipCssClass = this._options.tooltipClass;
    }

    tooltipLayer.className = ('lhjs-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');

    currentTooltipPosition = this._introItems[this._currentStep].position;
 
    targetOffset  = _getOffset(targetElement);
    tooltipOffset = _getOffset(tooltipLayer);
    windowSize    = _getWinSize();
 
    switch (currentTooltipPosition) {
    
      case 'bottom':
	  
      // Bottom going to follow the default behavior
      default:
        arrowLayer.className = 'lhjs-arrow top';
        var tooltipLayerStyleLeft = 0;
        _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
        tooltipLayer.style.top    = (targetOffset.height +  20) + 'px';
        break;
    }
  }
  function _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer) {
    if (targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width > windowSize.width) {
      tooltipLayer.style.left = (windowSize.width - tooltipOffset.width - targetOffset.left) + 'px';
      return false;
    }
    tooltipLayer.style.left = tooltipLayerStyleLeft + 'px';
    return true;
  }
  /**
   * 在屏幕上更新辅助层的位置
   */
  function _setHelperLayerPosition(helperLayer) {
	   
      if (!this._introItems[this._currentStep]) return;

      var currentElement  = this._introItems[this._currentStep],
          elementPosition = _getOffset(currentElement.element),
          widthHeightPadding = 10;



      if (currentElement.position == 'floating') {
        widthHeightPadding = 0;
      }
      helperLayer.setAttribute('style', 'width: ' + (elementPosition.width  + widthHeightPadding)  + 'px; ' +
                                        'height:' + (elementPosition.height + widthHeightPadding)  + 'px; ' +
                                        'top:'    + (elementPosition.top    - 5)   + 'px;' +
                                        'left: '  + (elementPosition.left   - 5)   + 'px;');

  }
  /**
   * 设置锚的行为像按钮
   */
  function _setAnchorAsButton(anchor){
    anchor.setAttribute('role', 'button');
    anchor.tabIndex = 0;
  }

  /**
   *显示界面
   */
  function _showElement(targetElement) {
    if (typeof (this._introChangeCallback) !== 'undefined') {
      this._introChangeCallback.call(this, targetElement.element);
    }

    var self = this,
        oldHelperLayer = document.querySelector('.lhjs-helperLayer'),
        oldReferenceLayer = document.querySelector('.lhjs-tooltipReferenceLayer'),
        highlightClass = 'lhjs-helperLayer',
        elementPosition = _getOffset(targetElement.element);
    if (typeof (targetElement.highlightClass) === 'string') {
      highlightClass += (' ' + targetElement.highlightClass);
    }
    if (typeof (this._options.highlightClass) === 'string') {
      highlightClass += (' ' + this._options.highlightClass);
    }

      var helperLayer       = document.createElement('div'),
          referenceLayer    = document.createElement('div'),
          arrowLayer        = document.createElement('div'),
          circularLayer     = document.createElement('div'),
          tooltipLayer      = document.createElement('div'),
          tooltipTextLayer  = document.createElement('div'),
          buttonsLayer      = document.createElement('div');

      helperLayer.className = highlightClass;
      referenceLayer.className = 'lhjs-tooltipReferenceLayer';

      //set new position to helper layer
      _setHelperLayerPosition.call(self, helperLayer);
      _setHelperLayerPosition.call(self, referenceLayer);

      //add helper layer to target element
      this._targetElement.appendChild(helperLayer);
      this._targetElement.appendChild(referenceLayer);

      arrowLayer.className = 'lhjs-arrow';
	  
	  circularLayer.className = 'lhjs-circular';

      tooltipTextLayer.className = 'lhjs-tooltiptext';
      tooltipTextLayer.innerHTML = targetElement.intro;
      var ulContainer = document.createElement('ul');

      for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
        var innerLi    = document.createElement('li');
        var anchorLink = document.createElement('a');
        if (i === (targetElement.step-1)) anchorLink.className = 'active';

        _setAnchorAsButton(anchorLink);
        anchorLink.innerHTML = "&nbsp;";
        anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

        innerLi.appendChild(anchorLink);
        ulContainer.appendChild(innerLi);
      }
      buttonsLayer.className = 'lhjs-tooltipbuttons';

      tooltipLayer.className = 'lhjs-tooltip';
      tooltipLayer.appendChild(tooltipTextLayer);
     
      if (this._options.showStepNumbers == true) {
        var helperNumberLayer = document.createElement('span');
        helperNumberLayer.innerHTML = targetElement.step;
        referenceLayer.appendChild(helperNumberLayer);
      }
      tooltipLayer.appendChild(arrowLayer);
	  tooltipLayer.appendChild(circularLayer);
	  
      referenceLayer.appendChild(tooltipLayer);
      var skipTooltipButton = document.createElement('a');
      _setAnchorAsButton(skipTooltipButton);
      skipTooltipButton.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
      };

      buttonsLayer.appendChild(skipTooltipButton);

      tooltipLayer.appendChild(buttonsLayer);
      _placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);


	if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
      skipTooltipButton.innerHTML = this._options.doneLabel;
      skipTooltipButton.className += ' lhjs-donebutton';
    }
    _setShowElement(targetElement);

    if (typeof (this._introAfterChangeCallback) !== 'undefined') {
      this._introAfterChangeCallback.call(this, targetElement.element);
    }
  }

  /**
   * 隐藏面板 
   */
  function _removeShowElement() {
    var elms = document.querySelectorAll('.lhjs-showElement');

    for (var i = 0, l = elms.length; i < l; i++) {
      var elm = elms[i];
      _removeClass(elm, /lhjs-[a-zA-Z]+/g);
    }
  }

 /**
  * 设置要显示的元素
  */
  function _setShowElement(targetElement) {
    _setClass(targetElement.element, 'lhjs-showElement');

    var currentElementPosition = _getPropValue(targetElement.element, 'position');
    if (currentElementPosition !== 'absolute' &&
        currentElementPosition !== 'relative' &&
        currentElementPosition !== 'fixed') {
      _setClass(targetElement.element, 'lhjs-relativePosition')
    }

    var parentElm = targetElement.element.parentNode;
    while (parentElm != null) {
      if (!parentElm.tagName || parentElm.tagName.toLowerCase() === 'body') break;
      var zIndex = _getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
      var transform = _getPropValue(parentElm, 'transform') || _getPropValue(parentElm, '-webkit-transform') || _getPropValue(parentElm, '-moz-transform') || _getPropValue(parentElm, '-ms-transform') || _getPropValue(parentElm, '-o-transform');
      if (/[0-9]+/.test(zIndex) || opacity < 1 || (transform !== 'none' && transform !== undefined)) {
        parentElm.className += ' lhjs-fixParent';
      }
      parentElm = parentElm.parentNode;
    }
  }

  /**
   *设置样式
   */
  function _setClass(element, className) {
      element.className += ' ' + className;
  }
  /**
   *移除样式
   */
  function _removeClass(element, classNameRegex) {
      element.className = element.className.replace(classNameRegex, '').replace(/^\s+|\s+$/g, '');
  }
   /**
    *获取一个元素的CSS属性
	*/
  function _getPropValue (element, propName) {
    var propValue = '';
    if (element.currentStyle) { //IE
      propValue = element.currentStyle[propName];
    } else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
      propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
    }

    //Prevent exception in IE
    if (propValue && propValue.toLowerCase) {
      return propValue.toLowerCase();
    } else {
      return propValue;
    }
  }
   
  /**
   *获取窗口大小
   */
  function _getWinSize() {
    if (window.innerWidth != undefined) {
      return { width: window.innerWidth, height: window.innerHeight };
    } else {
      var D = document.documentElement;
      return { width: D.clientWidth, height: D.clientHeight };
    }
  }

  /**
   * 检查元素是否在视图中
   */
  function _elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
      rect.right <= window.innerWidth
    );
  }

  /**
   * 向页面添加覆盖层
   *
   */
  function _addOverlayLayer(targetElm) {
	  
    var overlayLayer = document.createElement('div'),
        styleText = '',
        self = this;
    overlayLayer.className = 'lhjs-overlay';
    if (!targetElm.tagName || targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.setAttribute('style', styleText);
    }
    targetElm.appendChild(overlayLayer);
    overlayLayer.onclick = function() {
      if (self._options.exitOnOverlayClick == true) {
        _exitIntro.call(self, targetElm);
      }
    };

    setTimeout(function() {
      styleText += 'opacity: ' + self._options.overlayOpacity.toString() + ';';
      overlayLayer.setAttribute('style', styleText);
    }, 10);

    return true;
  }
  /**
   *获取偏移
   */
  function _getOffset(element) {
	 
    var elementPosition = {};
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
      elementPosition.width = element.offsetWidth;
      elementPosition.height = element.offsetHeight;
      var _x = 0;
      var _y = 0;
      while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        _x += element.offsetLeft;
        _y += element.offsetTop;
        element = element.offsetParent;
      }
      elementPosition.top = _y;
      elementPosition.left = _x;
    return elementPosition;
  }
  var lihengJs = function (targetElm) {
	  
    if (typeof (targetElm) === 'object') {
	 
      //Ok, create a new instance
      return new GuideJs(targetElm);

    } else if (typeof (targetElm) === 'string') {
		 
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
        return new GuideJs(targetElement);
      } else {
        throw new Error('There is no element with given selector.');
      }
    } else {
      return new GuideJs(document.body);
    }
  };
 

  //Prototype
  lihengJs.fn = GuideJs.prototype = {
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    }
  };

  exports.lihengJs = lihengJs;
  return lihengJs;
}));
