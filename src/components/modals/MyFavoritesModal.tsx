import { Msrating109 } from '@react95/icons';
import React, { MouseEventHandler, useRef } from 'react';
import Modal from './Modal';
import { ModalType } from '../../types/modalTypes';
import { MODAL_CONFIGS } from '../../configs/modalConfigs';

interface IMyFavoritesModalProps {
	open: boolean;
	style: React.CSSProperties;
	onOpen: MouseEventHandler<HTMLDivElement>;
	onClose: MouseEventHandler<HTMLButtonElement>;
	onMinimize: MouseEventHandler<HTMLButtonElement>;
}

const MyFavoritesModal = ({ open, style, onClose, onMinimize, onOpen }: IMyFavoritesModalProps) => {
	const MyFavoritesModalRef = useRef(null);
	const { key } = MODAL_CONFIGS.myFavorites;
	return (
		<Modal
			className="absolute"
			open={open}
			onClose={onClose}
			onMinimize={onMinimize}
			onOpen={onOpen}
			icon={<Msrating109 />}
			title="My Favorites"
			modalRef={MyFavoritesModalRef}
			style={style}
			modalKey={key as ModalType}
		>
			<div className="w-[500px]"></div>
		</Modal>
	);
};

export default MyFavoritesModal;
