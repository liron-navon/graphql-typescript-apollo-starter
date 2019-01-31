/**
 * This file is used to mock a database
 */
import { v4 as createUUID } from 'uuid';

// create a new book
export function createNewBook(bookInput: GQL.BookCreateInput): GQL.Book {
    const newBook = {
        ...bookInput,
        id: createUUID(),
        votes: 0,
        score: 0
    };

    mockBooks.push(newBook);
    return newBook;
}

// create a new writer
export function createNewWriter(writerInput: GQL.WriterCreateInput): GQL.Writer {
    const newWriter = {
        ...writerInput,
        id: createUUID()
    };

    mockWriters.push(newWriter);
    return newWriter;
}

export const mockBooks: GQL.Book[] = [
    {
        id: createUUID(),
        writerId: 'writer-0',
        name: 'The Outsider',
        score: 4,
        votes: 52,
        description: `The novel begins with the tone of a police procedural in its early parts, but shifts to a horror novel toward the end,
        employing two common genres of Stephen King. However, the plot is wholly consistent and split into several
        titled sections, each section containing multiple chapters. In addition, there is a small epilogue following the climax.
        The sections are ordered according to date in relativity to the inciting incident. The first section contains several
        fictional police documents.`
    },
    {
        id: createUUID(),
        writerId: 'writer-0',
        name: 'Cujo',
        score: 3.5,
        votes: 12,
        description: `Cujo's name was based on the nom de guerre of Willie Wolfe,
        one of the men responsible for orchestrating Patty Hearst's kidnapping and indoctrination into the Symbionese Liberation Army.
         Stephen King discusses Cujo in On Writing, referring to it as a novel he "barely remembers writing at all".
         The book was written during a period when King was on a cocaine binge.`
    },
    {
        id: createUUID(),
        writerId: 'writer-1',
        name: 'Moby-Dick',
        score: 4.7,
        votes: 1246,
        description: `Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville.
        The book is sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod,
        for revenge on Moby Dick, the white whale that on the ship's previous voyage bit off Ahab's leg at the knee.`
    },
    {
        id: createUUID(),
        writerId: 'writer-2',
        name: 'The Song of Achilles',
        score: 4.0,
        votes: 634,
        description: `Greece in the age of heroes. Patroclus,
        an awkward young prince, has been exiled to the court of King Peleus and his perfect son Achilles.
        By all rights their paths should never cross, but Achilles takes the shamed prince as his friend`
    },
    {
        id: createUUID(),
        writerId: 'writer-2',
        name: 'Madeline Miller',
        score: 5.0,
        votes: 3,
        description: `In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born.
        But Circe is a strange child—not powerful, like her father, nor viciously alluring like her mother.
        Turning to the world of mortals for companionship,
        she discovers that she does possess power—the power of witchcraft,
        which can transform rivals into monsters and menace the gods themselves.`
    }
];

export const mockWriters: GQL.Writer[] = [
    {
        id: createUUID(),
        name: 'Stephen King',
        birthDay: 'September 21, 1947',
        country: 'US'
    },
    {
        id: createUUID(),
        name: 'Herman Melville',
        birthDay: 'September 28, 1891',
        country: 'US'
    },
    {
        id: createUUID(),
        name: 'Madeline Miller',
        birthDay: 'July 24, 1978',
        country: 'US'
    }
];
