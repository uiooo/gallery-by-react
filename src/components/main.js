//var React=require('react');
import React from 'react';
//var ReactDOM=require('react-dom');
import ReactDOM from 'react-dom';
var imageData=require('../data/imageData.json');
require('../styles/main.less');
imageData=(function(imageDataArr){
	for(var i=0,j=imageDataArr.length;i<j;i++){
		var singleImageData=imageDataArr[i];
		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		imageDataArr[i]=singleImageData;
	}
	return imageDataArr;
})(imageData);
//

function getRangeRandom(low,high) {
	return Math.floor(Math.random()*(high - low) + low);
}
//随机角度
function get30DegRandom() {
	return ((Math.random() > 0.5?'':'-')+Math.floor(Math.random() * 30));
}
//单个图片的component
class ImgFigure extends React.Component{
	//imgFigure的点击函数
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		let styleObj = {};
		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		// 如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate+'deg)';
			}.bind(this))
		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
					<div className='imgBack' onClick={this.handleClick.bind(this)}>
						{this.props.data.desc}
					</div>
				</figcaption>
			</figure>
		);
	}
}
//底部控制点component
class ControllerUnit extends React.Component {
	handleClick(e){
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	}
	render() {
		let controllerUnitClassName = 'controller-unit';
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		)
	}
}
//整个gallery的component
class GalleryByReactApp extends React.Component{
	constructor(props){
		super(props);
		this.Constant = {
			centerPos:{
				left:0,
				right:0,
			},
			hPosRange:{
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{
				x:[0,0],
				topY:[0,0]
			}
		};
	
		this.state = {
			imgsArrangeArr: [
//				{
//					pos: {
//						left: '0',
//						top: '0'
//					},
//					rotate: 0,
//					isInverse: false,
//					isCenter: false
//				}
			]
		};
	}
	inverse(index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this)
	}
	center(index) {
		return function () {
			this.rearrange(index);
		}.bind(this);
	}
	rearrange(centerIndex) {
		//重新布局所有图片，@param centerIndex指定居中排布哪个图片
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hposRangeLeftSecX = hPosRange.leftSecX,
			hposRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			//设置上放图片，设置一个或者两个
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),//设置上方图片个数，随机一个或者两个
			topImgSpliceIndex = 0,//记录放到上方的图片的索引
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		//对居中的图片设置位置信息，并且不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}
		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		imgsArrangeTopArr.forEach(function(value,index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});
		//布局左右两侧的图片
		for(let i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;i++) {
			let hPosRangeLORX = null;
			if (i < k) {
				hPosRangeLORX = hposRangeLeftSecX;
			} else{
				hPosRangeLORX = hposRangeRightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})	
	}
	//组件加载后，为每张图片计算其位置的范围；
	componentDidMount(){
		let stageDom = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDom.scrollWidth,
				stageH = stageDom.scrollHeight,
				halfStageW = Math.ceil(stageW / 2),
				halfStageH = Math.ceil(stageH / 2);
				//拿到一个imageFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		//计算左侧，右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.rearrange(0);//将第一张图片居中显示
	}
	render(){
		let controllerUnits=[],
			imgFigures=[];
		imageData.forEach(function(value,index){
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} 
				ref={'imgFigures'+index} 
				inverse={this.inverse(index).bind(this)}
				center={this.center(index)}
				arrange={this.state.imgsArrangeArr[index]}/>);
			controllerUnits.push(<ControllerUnit key={index} 
				arrange={this.state.imgsArrangeArr[index]}
				inverse={this.inverse(index).bind(this)}
				center={this.center(index)}/>);
		}.bind(this));
		return (
			<section className='stage' ref='stage'>
				<section className='img-sec'>
					{imgFigures}
				</section>
				<nav className='controller-nav'>
					{controllerUnits}
				</nav>
			</section>
		)
	}
}
ReactDOM.render(<GalleryByReactApp />, document.getElementById('content'));














