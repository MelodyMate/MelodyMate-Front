import { Msrating109 } from '@react95/icons';
import React, { MouseEventHandler, useRef } from 'react';
import Modal from './Modal';
import { ModalType } from '../../types/modalTypes';
import { MODAL_CONFIGS } from '../../configs/modalConfigs';
import Frame from '../Frame';
import Button from '../buttons/Button';
import { truncateTitle } from '../../utils/utils';

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
	const items = Array.from({ length: 10 }, (_, index) => ({
		title: `이브, 프시케 그리고 푸른 수염의 아내 ${index + 1}`,
		subtitle: '서브타이틀',
		id: index,
	}));
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
			<div className="flex gap-1 ml-0.5 my-2">
				<Button className="px-3 py-[1px] text-sm">Playlist</Button>
				<Button className="px-3 py-[1px] text-sm">Mixtape</Button>
			</div>
			<Frame boxShadow="in" bg="white" className="overflow-x-auto max-h-96">
				{items.map((item, index) => (
					<div
						key={index}
						className="flex items-center justify-between p-2 border-b border-dashed xl:p-4 border-retroGray"
					>
						<div className="flex items-center mr-3 xl:mr-4">
							<div className="flex items-center font-eng justify-center w-8 h-8 text-lg xl:text-xl font-bold text-center leading-[2rem] xl:leading-[2.5rem] mr-2 xl:mr-4">
								<img src="/icon-bars.svg" alt="icon-bars" />
							</div>
							<div className="flex items-center space-x-2">
								<div className="flex items-center justify-center w-[68px] h-[38px] overflow-hidden xl:w-20 xl:h-11 bg-retroGray"></div>

								<div>
									<h4 className="font-bold">{truncateTitle(item.title)}</h4>
									<p className="text-xs xl:text-sm">{item.subtitle}</p>
								</div>
							</div>
						</div>
						<div>
							<button className="underline text-retroBlue">Remove</button>
						</div>
					</div>
				))}
			</Frame>
		</Modal>
	);
};

export default MyFavoritesModal;
