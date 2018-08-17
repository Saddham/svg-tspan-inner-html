(function() {
var toText = function(node, text) {
  var nodeType = node.nodeType;
  if (nodeType == 1) {
	    text.push('<', node.tagName);
	    if (node.hasAttributes()) {
	      var attrMap = node.attributes;
	      for (var i = 0, len = attrMap.length; i < len; ++i) {
	        var attrNode = attrMap.item(i);
	        text.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
	      }
	    }
	    if (node.hasChildNodes()) {
	      text.push('>');
	      var childNodes = node.childNodes;
	      for (var i = 0, len = childNodes.length; i < len; ++i)
	    	  toText(childNodes.item(i), text);
	      text.push('</', node.tagName, '>');
	    } else
	    	text.push('/>');
  	} else if (nodeType == 3)
  		text.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
}

Object.defineProperty(SVGTSpanElement.prototype, 'innerHTML', {
  get: function() {
    var text = [];
    var childNode = this.firstChild;
    while (childNode) {
      toText(childNode, text);
      childNode = childNode.nextSibling;
    }
    return text.join('');
  },
  set: function(text) {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    try {
      var domParser = new DOMParser();
      domParser.async = false;
      var svgText = '<svg xmlns=\'http://www.w3.org/2000/svg\'>' + text + '</svg>';
      var svg = domParser.parseFromString(svgText, 'text/xml').documentElement;

      var childNode = svg.firstChild;
      while(childNode) {
        this.appendChild(this.ownerDocument.importNode(childNode, true));
        childNode = childNode.nextSibling;
      }
    } catch(e) {
      throw new Error('Error parsing text');
    };
  }
});
})();
