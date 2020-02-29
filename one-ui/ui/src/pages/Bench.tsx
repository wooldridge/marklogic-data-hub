import React, { useState, useEffect, useContext } from 'react';
import styles from './Bench.module.scss';
import Flows from '../components/flows/flows';
import axios from 'axios'
import { RolesContext } from "../util/roles";

const Bench: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [flows, setFlows] = useState<any[]>([]);
    const [loads, setLoads] = useState<any[]>([]);

    // For role-based privileges
    const roleService = useContext(RolesContext);
    const canReadFlows = roleService.canReadFlows();
    const canWriteFlows = roleService.canWriteFlows();

    useEffect(() => {
        getFlows();
        getLoads();
        return (() => {
            setFlows([]);
            setLoads([]);
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
            console.log('********* ERROR', error);
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

    const updateFlow = async (payload, flowId) => {
        try {
            setIsLoading(true);
            let updatedFlow = {
                name: payload.name,
                description: payload.description,
            }
            let response = await axios.put(`/api/flows/` + flowId, updatedFlow);
            if (response.status === 200) {
                console.log('PUT flow success', response);
                setIsLoading(false);
            }
        }
        catch (error) {
            //let message = error.response.data.message;
            console.log('Error updating flow', error)
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
            console.log('Error deleting flow', error);
            setIsLoading(false);
        }
    }

    const getLoads = async () => {
        try {
            let response = await axios.get('/api/artifacts/loadData');
            if (response.status === 200) {
                setLoads(response.data);
                console.log('GET loads successful', response);
            } 
        } catch (error) {
            let message = error.response.data.message;
            console.log('Error getting loads', message);
        }
    }

    // The polling function
    function poll(fn, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;

        var checkCondition = function(resolve, reject) { 
            var ajax = fn();
            // dive into the ajax promise
            ajax.then( function(response){
                // If the condition is met, we're done!
                if(response.data.var == true) {
                    resolve(response.data.var);
                }
                // If the condition isn't met but the timeout hasn't elapsed, go again
                else if (Number(new Date()) < endTime) {
                    setTimeout(checkCondition, interval, resolve, reject);
                }
                // Didn't match and too much time, reject!
                else {
                    reject(new Error('timed out for ' + fn + ': ' + arguments));
                }
            });
        };

        return new Promise(checkCondition);
    }

    const runStep = async (flowId, stepId) => {
        try {
            setIsLoading(true);
            let body = [stepId];
            let response = await axios.post('/api/flows/' + flowId + '/run', body);
            if (response.status === 200) {
                console.log('POST run step', response);
                setIsLoading(false);
                poll(function(flowId, stepId) {
                    let jobId = response.data.jobId;
                    return axios.get('/api/jobs/' + jobId);
                }, 2000, 150).then(function() {
                    // Polling done, now do something else!
                    console.log('polling done!');
                }).catch(function() {
                    // Polling timed out, handle the error!
                    console.log('polling timeout!');
                });
            } 
        } catch (error) {
            //let message = error.response.data.message;
            console.log('Error running step', error);
            setIsLoading(false);
        }
    }

    // Usage: get something via ajax
    // poll(function(flowId, stepId) {
    //     let body = [stepId];
    //     return axios.post('/api/flows' + flowId + '/run');
    // }, 2000, 150).then(function() {
    //     // Polling done, now do something else!
    // }).catch(function() {
    //     // Polling timed out, handle the error!
    // });
    
    // DELETE /flows​/{flowId}​/steps​/{stepId}
    const deleteStep = async (flowId, stepId) => {
        let url = '/api/flows/' + flowId + '/steps/' + stepId + '-' + 'INGESTION';
        try {
            setIsLoading(true);
            let response = await axios.delete(url);
            if (response.status === 200) {
                console.log('DELETE step success', stepId);
                setIsLoading(false);
            } 
        } catch (error) {
            console.log('Error deleting step', error);
            setIsLoading(false);
        }
    }

  return (
    <div>
        <div className={styles.content}>
            <Flows 
                flows={flows} 
                loads={loads}
                deleteFlow={deleteFlow} 
                createFlow={createFlow}
                updateFlow={updateFlow}
                runStep={runStep}
                deleteStep={deleteStep}
                canReadFlows={canReadFlows}
                canWriteFlows={canWriteFlows}
            />
        </div>
    </div>
  );
}

export default Bench;