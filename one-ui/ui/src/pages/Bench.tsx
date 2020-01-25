import React, { useState, useEffect } from 'react';
import styles from './Bench.module.scss';
import Flows from '../components/flows/flows';
import axios from 'axios'

const Bench: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [flows, setFlows] = useState<any[]>([]);

    useEffect(() => {
        getFlows();
            
        return (() => {
            setFlows([]);
        })
    }, [isLoading]);

    const getFlows = async () => {
        try {
            let response = await axios.get('/api/flows');
            if (response.status === 200) {
                setFlows(response.data);
                console.log('GET flows successful', response);
            } 
        } catch (error) {
            let message = error.response.data.message;
            console.log('Error getting flows', message);
        }
    }

    const createFlow = async (payload) => {
        try {
            setIsLoading(true);
            let newFlow = {
                name: payload.name,
                description: payload.description,
                batchSize: 100,
                threadCount: 4,
                stopOnError: false,
                options: {},
                version: 0,
                steps: {}
            }
            let response = await axios.post(`/api/flows`, newFlow);
            if (response.status === 200) {
                console.log('POST flow success', response);
                setIsLoading(false);
            }
        }
        catch (error) {
            //let message = error.response.data.message;
            console.log('Error posting flow', error)
            setIsLoading(false);
        }
    }

    const deleteFlow = async (name) => {
        try {
            setIsLoading(true);
            let response = await axios.delete(`/api/flows/${name}`);
            if (response.status === 200) {
                console.log('DELETE flow success', name);
                setIsLoading(false);
            } 
        } catch (error) {
            //let message = error.response.data.message;
            console.log('Error deleting flow', error);
            setIsLoading(false);
        }
    }

  return (
    <div>
        <div className={styles.content}>
            <Flows 
                data={flows} 
                deleteFlow={deleteFlow} 
                createFlow={createFlow}
            />
        </div>
    </div>
  );
}

export default Bench;