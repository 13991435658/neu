import React, { useState } from 'react'

class Dg extends React.PureComponent{
    constructor(){
        super()
        this.cccc=()=>{console.log('ccccccc')}
    }
    state={
        a:1
    }
    aa = function(){
        console.log(55555555555)
    }
    bb(){
        console.log(6666666666)
    }
    render(){
       return (
        <button onClick={()=>{ 
            this.aa()
            this.bb()
            this.cccc()
            this.setState(({a:10}))
            this.setState({a:this.state.a+1})      //只运行到这里 2
            this.setState({a:this.state.a+1})      //只运行到这里 2
            this.setState((pre)=>({a:pre.a+1}))    //只运行到这里 3
            this.setState((pre)=>({a:pre.a+1}))    //只运行到这里 4
            this.setState({a:this.state.a+1})      //只运行到这里 2
            // setTimeout(() => {
            //     console.log(this.state.a)      
            //     this.setState({a:200})
            // }, 100);
            console.log(this)
        }}>
            {this.state.a}
            555
        </button>
        
       )
    }
}

const Fun = ()=>{
    const [a,seta] = useState(0)
    console.log(555)
    return (
        <button onClick={()=>{
            seta(a+1)
            setTimeout(() => {
                console.log(a)   //0
                seta(a+2)
            }, 100);
        }}>{a}</button>
    )
}

export default Dg

