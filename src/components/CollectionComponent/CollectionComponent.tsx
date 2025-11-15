import React, { useState, useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import { useLocation } from 'react-router-dom';
import Modal, {
  MODAL_TITLE,
  MODAL_DESCRIPTION,
  CloseButton,
  MediaContainer,
  TextContainer,
} from '../Modal/Modal';
import Loading from '../../assets/video/logo_animated_hq.webm';
import { supabase, supabaseUrl } from '../../supabaseClient';

import CloseIcon from '../../assets/icons/c_cross.svg?react';
import Left from '../../assets/icons/icon_left.svg';
import Right from '../../assets/icons/icon_right.svg';
import { Reveal } from '../../pages/Reveal/Reveal';

import {
  IMAGE_DOUBLE,
  IMAGE_TRIPLE,
  IMAGE_QUADRUPLE,
  IMAGE_QUINTUPLE,
  SliderWrapper,
  SliderContent,
  Slide,
  Arrow,
  COLLECTION_TEXT_TITLE_WRAPPER,
  COLLECTION_TEXT_TITLE,
  COLLECTION_1SEC_TITLE,
  COLLECTION_1SEC_DESCRIPTION,
  CollectionContainer,
  CollectionHeader,
  CollectionBlock,
  TextBlock,
  CollectionWrapper,
  CollectionAdditionalWrapper,
  COLLECTION_4SEC_TITLE,
  COLLECTION_4SEC_DESCRIPTION,
  CollectionTextWrapper,
  ImageBlock,
  VimeoContainer,
  WorkTextFilter,
  WorkFilterWrapp,
  WorkTitelContainer,
  WorkTitel,
  PlayerVimeo,
  VimeoVideoContainer,
  VideoCaption,
  CUSTOM_SPLITTER,
} from './CollectionComponent.styled';

/* ────────────────────────────────────────────── */
/* ТИПЫ                                           */
/* ────────────────────────────────────────────── */

export type BlockType =
  | 'IMAGE_SINGLE' 
  | 'IMAGE_DOUBLE'
  | 'IMAGE_TRIPLE'
  | 'IMAGE_QUADRUPLE'
  | 'IMAGE_QUINTUPLE'
  | 'SQUARES_2_1' | 'SQUARES_1_2'
  | 'TEXT_4SEC' | 'TEXT_2SEC'
  | 'TEXT_1SEC' | 'TEXT_1SEC_LP' | 'TEXT_TITLE'
  | 'VIMEO_PLAYER'
  | 'SPLITTER' | 'SPLITTER_SPACE' | 'SPLITTER_DEFAULT';

export interface CollectionBlockDB {
  id: number;
  collection_id: number;
  type: BlockType;
  content: any;             // см. README
  description: string | null;
  position: number;
}

export interface CollectionData {
  id: number;
  folder: string;
  blocks: CollectionBlockDB[];

  // теперь main не обязателен
  main?: {
    label: string;
    text: string;
    tag?: 'h1' | 'h2' | 'h3';
  }[];

  // если вам больше не нужен work_title, можно убрать
  work_title?: string;
}


interface CollectionComponentProps {
  collection: CollectionData;
  source?: 'work' | 'photo';
}

/* ────────────────────────────────────────────── */
/* КОМПОНЕНТ                                      */
/* ────────────────────────────────────────────── */
const CollectionComponent: React.FC<CollectionComponentProps> = ({
  collection,
  source,
}) => {
  /* ────────── фильтр в URL (оставил как было) ────────── */
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [filter, setFilter] = useState<'ALL' | 'COMMERCIAL' | 'PERSONAL'>(
    (searchParams.get('filter') as any) || 'ALL'
  );
  const updateUrlFilter = (newFilter: string) => {
    const params = new URLSearchParams(location.search);
    params.set('filter', newFilter);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  };
  const showFilter = location.pathname === '/work' || location.pathname === '/photo';
  const bucket = source === 'work'
    ? 'work-images'
    : 'photography-images';

  /* ────────── стейт блоков ────────── */
  const [blocks, setBlocks] = useState<CollectionBlockDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ────────── модалка ────────── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    altText: string;
    title?: string;
    description: string;
    vimeoId?: string;
  }>({
    url: '',
    type: 'image',
    altText: '',
    title: '',
    description: '',
  });

  const failedMedia = useRef<Set<string>>(new Set());
  const vimeoPlayerRef = useRef<Player | null>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);

  /* ────────── helpers ────────── */
  const imageUrl = (fileName: string) =>
    `${supabaseUrl}/storage/v1/object/public/${bucket}/${collection.folder}/${fileName}`;

  /* Validate tag to ensure it's a valid HTML tag and not a data URI */
  const isValidTag = (tag: any): tag is keyof JSX.IntrinsicElements => {
    if (typeof tag !== 'string') return false;
    // Prevent data URIs and other invalid tag names
    return /^[a-z][a-z0-9]*$/.test(tag) && !tag.includes(':') && !tag.includes('/');
  };


  const openModal = (
    src: string,
    type: 'image' | 'video',
    title = '',
    description = ''
  ) => {
    if (failedMedia.current.has(src)) return;
    console.log('🖼️ openModal called:', { src, type, title });
    setIsModalImageLoading(type === 'image');
    setCurrentMedia({
      url: type === 'image' ? src : '',
      type,
      altText: title,
      title,
      description,
    });
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalImageLoading(false);
  };

  /* ────────── загрузка блоков ────────── */
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      // work → project_blocks, photo → collection_blocks
      const blocksTable =
        source === 'work' ? 'project_blocks' : 'collection_blocks';

      const { data, error } = await supabase
        .from(blocksTable)
        .select('*')
        .eq('collection_id', collection.id)
        .order('position');

      if (error) console.error(error);
      setBlocks(data || []);
      setIsLoading(false);
    })();
  }, [collection.id, source]);

  /* ────────── Vimeo в модалке ────────── */
  useEffect(() => {
    if (
      isModalOpen &&
      currentMedia.type === 'video' &&
      currentMedia.vimeoId &&
      vimeoContainerRef.current
    ) {
      vimeoPlayerRef.current = new Player(vimeoContainerRef.current, {
        id: Number(currentMedia.vimeoId),
        width: 1280,
        height: 720,
        autoplay: true,
      });
      return () => {
        if (vimeoPlayerRef.current) {
          // destroy() возвращает Promise → отрабатываем, но ничего не возвращаем
          vimeoPlayerRef.current.destroy().catch(() => { });
          vimeoPlayerRef.current = null;
        }
      };
    }
  }, [isModalOpen, currentMedia]);

  /* ────────────────────────────────────────────── */
  /* HELPER                                         */
  /* ────────────────────────────────────────────── */

  interface ImageItem {
  src: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  images: ImageItem[];
  aspectRatio?: string;
}

interface ImageItem {
  src: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  images: ImageItem[];
  aspectRatio?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, aspectRatio }) => {
  const slides = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex]             = useState(1);
  const [animate, setAnimate]         = useState(true);
  const [offset, setOffset]           = useState(0);
  const [isDragging, setIsDragging]   = useState(false);
  const [isVisible, setIsVisible]     = useState(false);

  const transitioningRef              = useRef(false);
  const sliderRef                     = useRef<HTMLDivElement>(null);
  const slideWidthRef                 = useRef(0);

  // для рассчёта мгновенной скорости
  const startXRef       = useRef(0);
  const lastXRef        = useRef(0);
  const startTimeRef    = useRef(0);
  const lastTimeRef     = useRef(0);
  const lastVelocityRef = useRef(0);

  // интервал автоплей
  const autoPlayRef     = useRef<number>();

  // Стрелки
  const prevSlide = () => {
    if (transitioningRef.current) return;
    setAnimate(true);
    setIndex(i => i - 1);
    transitioningRef.current = true;
  };
  const nextSlide = () => {
    if (transitioningRef.current) return;
    setAnimate(true);
    setIndex(i => i + 1);
    transitioningRef.current = true;
  };

  // Drag logic
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || transitioningRef.current) return;
    const el = sliderRef.current!;
    el.setPointerCapture(e.pointerId);

    setIsDragging(true);
    slideWidthRef.current    = el.clientWidth;
    startXRef.current        = e.clientX;
    lastXRef.current         = e.clientX;
    startTimeRef.current     = Date.now();
    lastTimeRef.current      = Date.now();
    lastVelocityRef.current  = 0;
    setAnimate(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || transitioningRef.current) return;
    const now     = Date.now();
    const dxLocal = e.clientX - lastXRef.current;
    const dtLocal = now - lastTimeRef.current;
    if (dtLocal > 0) lastVelocityRef.current = dxLocal / dtLocal;
    lastXRef.current    = e.clientX;
    lastTimeRef.current = now;

    const dx = e.clientX - startXRef.current;
    setOffset(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const el = sliderRef.current!;
    el.releasePointerCapture(e.pointerId);

    setIsDragging(false);
    const dx        = offset;
    const vel       = Math.abs(lastVelocityRef.current);
    const threshold = slideWidthRef.current * 0.5;

    let newIdx = index;
    if (dx >  threshold || vel > 0.2) newIdx = index - 1;
    if (dx < -threshold || vel > 0.2) newIdx = index + 1;

    setAnimate(true);
    setOffset(0);
    if (!transitioningRef.current) {
      setIndex(newIdx);
      transitioningRef.current = true;
    }
  };

  const handleTransitionEnd = () => {
    transitioningRef.current = false;
    if (index === 0) {
      setAnimate(false);
      setIndex(images.length);
    } else if (index === slides.length - 1) {
      setAnimate(false);
      setIndex(1);
    }
  };

  // восстановление animate после программного сброса
  useEffect(() => {
    if (!animate) requestAnimationFrame(() => setAnimate(true));
  }, [animate]);

  // IntersectionObserver для видимости
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (sliderRef.current) obs.observe(sliderRef.current);
    return () => obs.disconnect();
  }, []);

  // Автоплей каждые 2 сек, когда видим и не драгаем и не анимируем
  useEffect(() => {
    if (isVisible && !isDragging && !transitioningRef.current) {
      autoPlayRef.current = window.setInterval(() => {
        nextSlide();
      }, 3000);
    } else {
      window.clearInterval(autoPlayRef.current);
    }
    return () => window.clearInterval(autoPlayRef.current);
  }, [isVisible, isDragging]);

  return (
    <SliderWrapper
      ref={sliderRef}
      $aspectRatio={aspectRatio}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Arrow left onClick={prevSlide} aria-label="Previous slide" role="button" tabIndex={0}>
        <img src={Left} alt="Previous slide" />
      </Arrow>
      <Arrow onClick={nextSlide} aria-label="Next slide" role="button" tabIndex={0}>
        <img src={Right} alt="Next slide" />
      </Arrow>

      <SliderContent
        index={index}
        animate={animate}
        offset={offset}
        isDragging={isDragging}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((img, i) => (
          <Slide key={i}>
            <img src={img.src} alt={img.title || `Slide ${i + 1} of ${slides.length}`} draggable={false} />
          </Slide>
        ))}
      </SliderContent>
    </SliderWrapper>
  );
};



  
  /* ────────── рендер одного блока ────────── */
  const blockTypeToWrapper = {
    IMAGE_DOUBLE: IMAGE_DOUBLE,
    IMAGE_TRIPLE: IMAGE_TRIPLE,
    IMAGE_QUADRUPLE: IMAGE_QUADRUPLE,
    IMAGE_QUINTUPLE: IMAGE_QUINTUPLE
  };


const renderImageGridBlock = (b: CollectionBlockDB) => {
  const items = b.content?.items || [];
  const aspectRatio = b.content?.aspectRatio || '16 / 9';

  if (!items.length) return null;

  const Wrapper = blockTypeToWrapper[b.type];
  if (!Wrapper) return null;

  return (
    <Wrapper
      key={b.id}
      $itemsCount={items.length}
      $aspectRatio={aspectRatio}
    >
      {items.map((item, i) => (
        <div key={i}>
          <img
            src={imageUrl(item.src)}
            alt={item.title || `Image ${i + 1} from collection`}
            onClick={() =>
              openModal(
                imageUrl(item.src),
                'image',
                item.title || '',
                item.description || ''
              )
            }
            role="button"
            tabIndex={0}
            aria-label={item.title ? `View ${item.title}` : `View image ${i + 1}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(
                  imageUrl(item.src),
                  'image',
                  item.title || '',
                  item.description || ''
                );
              }
            }}
          />
        </div>
      ))}
    </Wrapper>
  );
};

  
  const renderBlock = (b: CollectionBlockDB) => {
  switch (b.type) {
    case 'IMAGE_SINGLE': {
      const aspectRatio = b.content?.aspectRatio || '2 / 1';
      const images: ImageItem[] = b.content.items?.map((image: any) => ({
        src: imageUrl(image.src),
        title: image.title,
        description: image.description,
      })) || [];

      if (images.length === 0) return null;

      return <ImageSlider images={images} aspectRatio={aspectRatio}/>;
    }

    case 'IMAGE_DOUBLE':
    case 'IMAGE_TRIPLE':
    case 'IMAGE_QUADRUPLE':
    case 'IMAGE_QUINTUPLE':
      return renderImageGridBlock(b);
        
      /* ----- квадрат + текст ----- */
      /* ----- квадрат + текст ----- */
      case 'SQUARES_2_1':
      case 'SQUARES_1_2': {
        const item = b.content.items?.[0];
        if (!item) return null;

        const Pic = (
          <ImageBlock>
            <img
              src={imageUrl(item.src)}
              alt={item.title || 'Collection image'}
              onClick={() =>
                openModal(
                  imageUrl(item.src),
                  'image',
                  item.title || '',        // <-- это заголовок внутри модалки
                  item.description || ''   // <-- это описание внутри модалки
                )
              }
              role="button"
              tabIndex={0}
              aria-label={item.title ? `View ${item.title}` : 'View collection image'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(
                    imageUrl(item.src),
                    'image',
                    item.title || '',
                    item.description || ''
                  );
                }
              }}
            />
          </ImageBlock>
        );

        const Txt = (
          <TextBlock>
            {/* это однострочная надпись сбоку от изображения */}
            {item.label && (
              <h2>
                {item.label.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h2>
            )}

          </TextBlock>
        );

        return (
          <CollectionBlock key={b.id}>
            {b.type === 'SQUARES_1_2' ? Txt : Pic}
            {b.type === 'SQUARES_1_2' ? Pic : Txt}
          </CollectionBlock>
        );
      }

        /* ----- текстовые секции ----- */

        interface Section {
          label: string;
          text: string;
          tag?: 'h1' | 'h2' | 'h3';
        }


    case 'TEXT_4SEC':
      return (
        <CollectionAdditionalWrapper>
          <CollectionHeader
            key={b.id}
            style={b.type.endsWith('_LP') ? { padding: '10px 0' } : {}}
          >
            {b.content.sections.map((s: Section, i: number) => (
              <CollectionWrapper key={i}>
                <COLLECTION_4SEC_TITLE>{s.label}</COLLECTION_4SEC_TITLE>
                <COLLECTION_4SEC_DESCRIPTION as={isValidTag(s.tag) ? (s.tag as any) : 'h2'}>
                  {s.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </COLLECTION_4SEC_DESCRIPTION>
              </CollectionWrapper>
            ))}
          </CollectionHeader>
        </CollectionAdditionalWrapper>
      );

      case 'TEXT_2SEC':
      return (
        <CollectionAdditionalWrapper>
          <CollectionHeader
            key={b.id}
            style={b.type.endsWith('_LP') ? { padding: '10px 0' } : {}}
          >
            {b.content.sections.map((s: Section, i: number) => (
              <CollectionWrapper key={i}>
                <COLLECTION_4SEC_TITLE>{s.label}</COLLECTION_4SEC_TITLE>
                <COLLECTION_4SEC_DESCRIPTION as={isValidTag(s.tag) ? (s.tag as any) : 'h2'}>
                  {s.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </COLLECTION_4SEC_DESCRIPTION>
              </CollectionWrapper>
            ))}
          </CollectionHeader>
        </CollectionAdditionalWrapper>
      );

      interface TextSegmentB {
        text: string;
        tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
        link?: string;
      }
      interface SectionB {
        label: string;
        segments: TextSegmentB[];
      }
      case 'TEXT_1SEC':
      case 'TEXT_1SEC_LP':
        return (
          <CollectionAdditionalWrapper>
            <CollectionTextWrapper key={b.id}>
              {b.content.sections.map((section: SectionB, i: number) => (
                <div key={i}>
                  <COLLECTION_1SEC_TITLE>{section.label}</COLLECTION_1SEC_TITLE>
                  <COLLECTION_1SEC_DESCRIPTION>
                    {section.segments.map((seg, idx) => {
                      // Выбираем тэг: h1-h5 или span
                      // Validate tag to ensure it's a valid HTML tag and not a data URI
                      const isValidTag = (tag: any): tag is keyof JSX.IntrinsicElements => {
                        if (typeof tag !== 'string') return false;
                        // Prevent data URIs and other invalid tag names
                        return /^[a-z][a-z0-9]*$/.test(tag) && !tag.includes(':') && !tag.includes('/');
                      };
                      const Tag = isValidTag(seg.tag) ? seg.tag : 'span';

                      // Функция для разбивки по \n
                      const renderTextWithBreaks = (text: string) =>
                        text.split('\n').map((line, lineIdx) => (
                          <React.Fragment key={lineIdx}>
                            {line}
                            {lineIdx < text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ));

                      // Содержимое тега
                      const element = (
                        <Tag key={idx} style={{ display: 'inline' }}>
                          {renderTextWithBreaks(seg.text)}
                        </Tag>
                      );

                      // Если есть ссылка — оборачиваем
                      return seg.link ? (
                        <a
                          key={idx}
                          href={seg.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${seg.text} (opens in new tab)`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {element}
                        </a>
                      ) : element;
                    })}
                  </COLLECTION_1SEC_DESCRIPTION>
                </div>
              ))}
            </CollectionTextWrapper>
          </CollectionAdditionalWrapper>
        );
        
        case 'TEXT_TITLE': {
      // предполагаем, что content имеет именно такую форму:
      // { style: 'h1'|'h2'|'h3', text: string, fontsize: string, align: 'left'|'center'|'right' }
      const { style, text, fontsize, align } = b.content as {
        style: 'h1' | 'h2' | 'h3';
        text: string;
        fontsize: string;
        align: 'left' | 'center' | 'right';
      };

      return (
        <COLLECTION_TEXT_TITLE_WRAPPER key={b.id} align={align}>
          <COLLECTION_TEXT_TITLE
            as={style}
            fontSize={fontsize}
            align={align}
          >
            {text}
          </COLLECTION_TEXT_TITLE>
        </COLLECTION_TEXT_TITLE_WRAPPER>
      );
    }
      

      /* ----- Vimeo ----- */
      case 'VIMEO_PLAYER':
        return (
          <PlayerVimeo key={b.id}>
            <VimeoVideoContainer>
              <iframe
                src={`https://player.vimeo.com/video/${b.content.vimeoId}?autoplay=0&loop=0&title=0&byline=0&portrait=0&controls=1&share=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                frameBorder={0}
              />
            </VimeoVideoContainer>
            {b.description && (
              <VideoCaption>
                <p>{b.description}</p>
                {collection.work_title && <h3>{collection.work_title}</h3>}
              </VideoCaption>
            )}
          </PlayerVimeo>
        );

      /* ----- разделители ----- */
      case 'SPLITTER_DEFAULT':
        return <hr key={b.id} style={{ margin: '20px 0', borderColor: '#444' }} />;
      case 'SPLITTER':
        return <CUSTOM_SPLITTER/>;
      case 'SPLITTER_SPACE': {
        const height = b.content?.size || '100px'; // fallback if no size is defined
        return <div key={b.id} style={{ height }} />;
      }

      default:
        return null;
    }
  };

  /* ────────── LOADING ────────── */
  if (isLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}
      >
        <video
          src={Loading}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  }

  /* ────────── MAIN JSX ────────── */
  return (
    <CollectionContainer>
      {/* ——— верхний титул и фильтр ——— */}
      {showFilter && (
        <WorkTitelContainer>
          <WorkTitel>{source === 'photo' ? 'PHOTOGRAPHY' : 'WORK'}</WorkTitel>
          <WorkFilterWrapp>
            {['ALL', 'COMMERCIAL', 'PERSONAL'].map(cat => (
              <WorkTextFilter
                key={cat}
                onClick={() => {
                  if (filter !== cat) {
                    setFilter(cat as any);
                    updateUrlFilter(cat);
                  }
                }}
                className={filter === cat ? 'active' : ''}
                aria-label={`Filter by ${cat}`}
                aria-pressed={filter === cat}
                role="button"
              >
                {cat}
              </WorkTextFilter>
            ))}
          </WorkFilterWrapp>
        </WorkTitelContainer>
      )}

      {/* ——— хедер коллекции ——— */}
      {collection.main && (
        <CollectionAdditionalWrapper>
        <CollectionHeader>
          {collection.main.map(
            (
              s: {
                label: string;
                text: string;
                tag?: 'h1' | 'h2' | 'h3';
              },
              i: number
            ) => (
              <CollectionWrapper key={i}>
                <COLLECTION_4SEC_TITLE>{s.label}</COLLECTION_4SEC_TITLE>
                <COLLECTION_4SEC_DESCRIPTION
                  as={s.tag || 'h1'}
                  dangerouslySetInnerHTML={{ __html: s.text }}
                />
              </CollectionWrapper>
            )
          )}
        </CollectionHeader>
        </CollectionAdditionalWrapper>
      )}


      {/* ——— контент из collection_blocks ——— */}
      {blocks.map(b => (
       <Reveal key={b.id}>
         {renderBlock(b)}
         </Reveal>
         ))}

      {/* ——— модалка ——— */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CloseButton 
            onClick={closeModal}
            aria-label="Close modal"
            title="Close modal (Press Escape)"
          >
            <CloseIcon />
          </CloseButton>
          <MediaContainer>
            {isModalImageLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60vh',
                color: '#fff',
              }}>
                Loading...
              </div>
            )}
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.altText}
                data-modal-img
                onLoad={() => setIsModalImageLoading(false)}
                onError={() => {
                  failedMedia.current.add(currentMedia.url);
                  setIsModalImageLoading(false);
                }}
                style={{ display: isModalImageLoading ? 'none' : 'block' }}
              />
            ) : currentMedia.vimeoId ? (
              <VimeoContainer ref={vimeoContainerRef} />
            ) : (
              <video
                src={currentMedia.url}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                }}
              />
            )}
          </MediaContainer>
          {(currentMedia.title || currentMedia.description || collection.work_title) && (
            <TextContainer>
              {currentMedia.title && (
                <MODAL_TITLE style={{ paddingTop: '20px', paddingBottom: '5px' }}>
                  {currentMedia.title}
                </MODAL_TITLE>
              )}
              {currentMedia.description && (
                <MODAL_DESCRIPTION style={{ paddingTop: '10px', paddingBottom: '30px' }}>
                  {currentMedia.description}
                </MODAL_DESCRIPTION>
              )}
            </TextContainer>
          )}


        </Modal>
      )}
    </CollectionContainer>
  );
};

export default CollectionComponent;
