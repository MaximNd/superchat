import { Injectable } from '@nestjs/common';
import { IContact } from 'shared';
import { IgnoreBot } from './../../bots/IgnoreBot';
import { ReverseBot } from './../../bots/ReverseBot';
import { SpamBot } from './../../bots/SpamBot';
import { EchoBot } from './../../bots/EchoBot';
import { Contact } from '../../contact/Contact';
import { IBot } from '../../bots/IBot';
import { UnknownContact } from '../../contact/UnknownContact';

@Injectable()
export class ContactService {
  private static nextID: number = 0;
  private static unknownCounter: number = 0;
  private getNextID(): number {
    return ++ContactService.nextID;
  }
  private botContacts: IContact[] = [
    new EchoBot(
      this.getNextID(),
      'EchoBot',
      'echo-bot-avatar.jpg',
      'An echo is a sound that is repeated because the sound waves are reflected back. Sound waves can bounce off smooth, hard objects in the same way as a rubber ball bounces off the ground. Although the direction of the sound changes, the echo sounds the same as the original sound.',
      true,
    ),
    new ReverseBot(
      this.getNextID(),
      'ReverseBot',
      'reverse-bot-avatar.jpg',
      '.sunim emixam ,orrop otcetihcra eropmet eativ erolod di siitidnalb ,allun etsi erotnevni maN .rutenet etsi sudnelleper somissingid muitnasucca saila eauq des obacilpxE .tile gnicisipida rutetcesnoc tema tis rolod muspi meroL',
      true,
    ),
    new SpamBot(
      this.getNextID(),
      'SpamBot',
      'spam-bot-avatar.jpg',
      `ᕦ(✧ᗜ✧)ᕥ You take the moon and you take the sun. ᕦ(✧ᗜ✧)ᕥ
( ͡° ͜ʖ ͡°) You take everything that sounds like fun. ( ͡° ͜ʖ ͡°)
☞♥Ꮂ♥☞ You stir it all together and then you're done. ☞♥Ꮂ♥☞
 ᕙ(◍.◎)ᕗ Rada rada rada rada rada rada.  ᕙ(◍.◎)ᕗ`,
      true,
    ),
    new IgnoreBot(
      this.getNextID(),
      'IgnoreBot',
      'ignore-bot-avatar.jpg',
      '...',
      true,
    ),
  ];
  private userContacts: IContact[] = [
    new Contact(
      this.getNextID(),
      'Batman',
      'batman-avatar.png',
      'Genius-level intellect Expert detective Peak human condition Master martial artist and hand-to-hand combatant Utilizes high-tech equipment',
      false,
    ),
    new Contact(
      this.getNextID(),
      'Hulk',
      'hulk-avatar.jpg',
      'The character is both the Hulk, a green-skinned, hulking and muscular humanoid possessing a vast degree of physical strength, and his alter ego Dr. Robert Bruce Banner, a physically weak, socially withdrawn, and emotionally reserved physicist, the two existing as independent personalities.',
      false,
    ),
    new Contact(
      this.getNextID(),
      'Spider-Man',
      'spider-man-avatar.jpg',
      'Spider-Man has spider-like abilities including superhuman strength and the ability to cling to most surfaces. He is also extremely agile and has amazing reflexes. Spider-Man also has a “spider sense,” that warns him of impending danger. Spider-Man has supplemented his powers with technology.',
      false,
    ),
    new Contact(
      this.getNextID(),
      'Wolverine',
      'wolverine-avatar.jpg',
      'He is a mutant who possesses animal-keen senses, enhanced physical capabilities, powerful regenerative ability known as a healing factor, and three retractable claws in each hand. Wolverine has been depicted variously as a member of the X-Men, Alpha Flight, and the Avengers.',
      false,
    ),
    new Contact(
      this.getNextID(),
      'Sonic',
      'sonic-avatar.jpg',
      'Sonic is a blue anthropomorphic hedgehog who can run at supersonic speeds and curl into a ball, primarily to attack enemies. In most games, Sonic must race through levels, collecting power-up rings and avoiding obstacles and enemies.',
      false,
    ),
    new Contact(
      this.getNextID(),
      'Gandalf',
      'gandalf-avatar.jpg',
      'Gandalf, or Gandalf the Grey, is a wizard. He is a good man who knows all life in middle earth and is open-minded even to the lowliest of creatures.',
      false,
    ),
  ];

  getContacts(): IContact[] {
    return [...this.botContacts, ...this.userContacts];
  }

  getBots(): IContact[] {
    return this.botContacts;
  }

  getContactById(id: number): IContact {
    return this.getContacts().find(contact => contact.Id === id);
  }

  getUserContactById(id: number): IContact {
    return this.userContacts.find(userContact => userContact.Id === id);
  }

  getUserContactBySocketId(socketId: string) {
    return this.userContacts.find(
      userContact => userContact.SocketId === socketId,
    );
  }

  getAvailableContact(): IContact {
    const offlineContacts = this.userContacts.filter(
      userContact => !userContact.IsOnline,
    );
    const min = 0;
    const max = offlineContacts.length - 1;
    const randIndex = Math.floor(min + Math.random() * (max + 1 - min));
    const contact = offlineContacts[randIndex];
    if (!contact) {
      const unknownContact = new UnknownContact(
        this.getNextID(),
        `Unknown hero-${++ContactService.unknownCounter}`,
        'unknown-avatar.jpg',
        '???',
        true,
      );
      this.userContacts.push(unknownContact);
      return unknownContact;
    }
    contact.IsOnline = true;
    return contact;
  }

  setOffline(contact: IContact) {
    if (contact) {
      contact.handleDisconnect();
      if (contact instanceof UnknownContact) {
        const index = this.userContacts.findIndex(
          unknownUser => unknownUser.Id === contact.Id,
        );
        this.userContacts.splice(index, 1);
      }
    }
  }
}
