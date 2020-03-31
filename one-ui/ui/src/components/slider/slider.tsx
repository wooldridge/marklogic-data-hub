import React from 'react'
import { Slider, Handles } from 'react-compound-slider'
import './tooltip.css';

export function Handle({
    handle: { id, value, percent },
    getHandleProps
  }) {
    return (
      <>
        <div
          style={{
            left: `${percent}%`,
            position: 'absolute',
            marginLeft: '-11px',
            marginTop: '-5px',
          }}
        >
          <div className="tooltip">
            <div className="tooltiptext"> id, value, percent: {id}, {value}, {percent}</div>
            <div className="tooltiptext"> id, value, percent: {id}, {value}, {percent}</div>
          </div>
        </div>
        <div
          style={{
            left: `${percent}%`,
            position: 'absolute',
            marginLeft: -15,
            marginTop: 25,
            zIndex: 2,
            width: 30,
            height: 30,
            border: 0,
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            backgroundColor: '#2C4870',
            color: '#333',
          }}
          {...getHandleProps(id)}
        >
          {/* <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
            {value}
          </div> */}
        </div>
      </>
    )
  }

const Example = (props) => {

    const options = [
      {
        props: [        
            {
            prop: 'First',
            type: 'Exact'
          },
          {
            prop: 'Last',
            type: 'Synonym'
          }
        ],
        value: 10
      },
      {
        props: [        
            {
            prop: 'DOB',
            type: 'Exact'
          }
        ],
        value: 40
      },
    ];

    return (
      <div style={{ height: 120, width: '100%' }}>
        {/* <ValueViewer values={values} update={update} /> */}
        <Slider
            rootStyle={{  // Give the slider some width
                position: 'relative',
                width: '100%',
                height: 80,
                border: '1px solid steelblue',
              } /* inline styles for the outer div. Can also use className prop. */}
            domain={[0, 200]}
            // values={[10, 20]}
            values={options.map(opt => opt.value)}
            step={1}
        >
            <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: 10,
                    marginTop: 35,
                    borderRadius: 5,
                    backgroundColor: '#8B9CB6',
                } /* Add a rail as a child.  Later we'll make it interactive. */} 
            />
            <Handles>
            {({ handles, getHandleProps }) => (
                <div className="slider-handles">
                {handles.map(handle => (
                    <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                    />
                ))}
                </div>
            )}
            </Handles>
        </Slider>
      </div>
    )
}

export default Example;