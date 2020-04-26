import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faFileExport, faLink, faTrashAlt, faListOl } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../../../util/user-context';
import { queryDateConverter } from '../../../util/date-conversion';
import EditQueryDialog from './edit-query-dialog/edit-query-dialog'
import { SearchContext } from '../../../util/search-context';
import styles from './manage-query.module.scss';
import { fetchQueries, updateQuery, removeQuery } from '../../../api/queries'


const QueryModal: React.FC = () => {

    const [queries, setQueries] = useState([]);
    const { handleError, resetSessionTime } = useContext(UserContext);
    const { applyQuery } = useContext(SearchContext);
    const [mainModalVisibility, setMainModalVisibility] = useState(false);
    const [editModalVisibility, setEditModalVisibility] = useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState({});
    const [queryName, setQueryName] = useState('');
    const data = new Array();

    useEffect(() => {
        getQueries();
    }, [mainModalVisibility, editModalVisibility, deleteModalVisibility]);

    const getQueries = async () => {
        try {
            const response = await fetchQueries();

            if (response['data']) {
                setQueries(response['data']);
            }
        } catch (error) {
            handleError(error);
        } finally {
            resetSessionTime();
        }
    }

    const editQuery = async (query) => {
        try {
            const response = await updateQuery(query);

            if (response.data) {
                setQueries(response.data);
                return { code: response.status };
            }

        } catch (error) {
            handleError(error);
        } finally {
            resetSessionTime();
        }
    }

    const deleteQuery = async (query) => {
        try {
            await removeQuery(query);
        } catch (error) {
            handleError(error);
        } finally {
            resetSessionTime();
        }
    }

    const onEdit = () => {
        setEditModalVisibility(true);
    }

    const onDelete = () => {
        setDeleteModalVisibility(true);
    }

    const displayModal = () => {
        setMainModalVisibility(true);
    };

    const onClose = () => {
        setMainModalVisibility(false);
    };

    const onOk = (query) => {
        deleteQuery(query)
        setDeleteModalVisibility(false);
    }

    const onCancel = () => {
        setDeleteModalVisibility(false);
    }

    const onApply = (e) => {
        queries && queries.length > 0 && queries.forEach(query => {
            if (e.currentTarget.dataset.id === query['savedQuery']['name']) {
                applyQuery(query['savedQuery']['query']['searchText'], query['savedQuery']['query']['entityTypeIds'], query['savedQuery']['query']['selectedFacets'])
            }
        })
        setMainModalVisibility(false)
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: 200,
            render: text => <a data-id={text} data-testid={text} className={styles.name} onClick={onApply}>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: text => <div className={styles.cell}>{text}</div>,
        },
        {
            title: 'Edited',
            dataIndex: 'edited',
            key: 'edited',
            sorter: (a, b) => a.edited.localeCompare(b.edited),
            width: 200,
            render: text => <div className={styles.cell}>{text}</div>,
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            align: 'center' as 'center',
            render: text => <a data-id={text} onClick={onEdit}>{text}</a>,
            width: 75,
        },
        {
            title: 'Export',
            dataIndex: 'export',
            key: 'export',
            align: 'center' as 'center',
            width: 75,
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            align: 'center' as 'center',
            width: 75,
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            align: 'center' as 'center',
            render: text => <a data-id={text} onClick={onDelete}>{text}</a>,
            width: 75,
        }
    ];

    queries && queries.length > 0 && queries.forEach((query, index) => {
        data.push(
            {
                key: query['savedQuery']['id'],
                name: query['savedQuery']['name'],
                description: query['savedQuery']['description'],
                edited: queryDateConverter(query['savedQuery']['systemMetadata']['lastUpdatedDateTime']),
                edit: <FontAwesomeIcon icon={faPencilAlt} color='#5B69AF' size='lg' />,
                export: <FontAwesomeIcon icon={faFileExport} color='#5B69AF' size='lg' />,
                link: <FontAwesomeIcon icon={faLink} color='#5B69AF' size='lg' />,
                delete: <FontAwesomeIcon icon={faTrashAlt} color='#B32424' size='lg' />
            }
        )
    })

    const deleteConfirmation = <Modal
        title="Confirmation"
        visible={deleteModalVisibility}
        okText='Yes'
        cancelText='No'
        onOk={() => onOk(selectedQuery)}
        onCancel={() => onCancel()}
        width={300}
        maskClosable={false}
    >
        <span style={{ fontSize: '16px' }}>Are you sure you want to delete '{queryName}'?</span>
    </Modal>;

    return (
        <div>
            <FontAwesomeIcon icon={faListOl} color='#5B69AF' size='lg' onClick={displayModal} style={{ cursor: 'pointer', marginLeft: '-30px', color: '#5B69AF' }} data-testid="manage-queries-modal-icon"/>
            <Modal
                title={null}
                visible={mainModalVisibility}
                onCancel={onClose}
                width={1000}
                footer={null}
                maskClosable={false}
            >
                <p className={styles.title} data-testid="manage-queries-modal">{"Manage Queries"}</p>
                <Table columns={columns} dataSource={data}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                queries.forEach((query) => {
                                    if (query['savedQuery']['id'] === record.key) {
                                        setSelectedQuery(query);
                                        setQueryName(record.name);
                                    }
                                })
                            }
                        }
                    }}>
                </Table>
            </Modal>
            <EditQueryDialog query={selectedQuery} editQuery={editQuery} getQueries={getQueries} editModalVisibility={editModalVisibility} setEditModalVisibility={setEditModalVisibility} />
            {deleteConfirmation}
        </div>
    )
}

export default QueryModal;