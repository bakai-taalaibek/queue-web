import { create } from "zustand";

export const useServiceChooser = create((set, get) => ({
	parameters: {
		city: null,
		address: null,
		service: null,
		serviceName: [],
		client_type: null,
		is_pensioner: false,
		is_appointment: null,
		appointment_date: null,
		comment: null,
		branch: null,
		branchAddress: ''
	},
	setService: (newService) => {
		set({ parameters: {...get().parameters, service: newService.id, serviceName: newService.lang_name } })
	},
	setPersonState: (newPerson) => {
		set({ parameters: {...get().parameters, client_type: newPerson} })
	},
	setPensionerState: (newPensioner) => {
		set({ parameters: {...get().parameters, is_pensioner: newPensioner} })
	},
	setCity: (newCity) => {
		set({ parameters: {...get().parameters, city: newCity} })
	},
	setBranchAddress: (newBranchAddress) => {
		set({ parameters: {...get().parameters, branchAddress: newBranchAddress} })
	},
	setIsAppointment: (newIsAppointment) => {
		set({ parameters: {...get().parameters, is_appointment: newIsAppointment} })
	},
	setBranch: (newBranch) => {
		set({ parameters: {...get().parameters, branch: newBranch} })
	},
	setDateAndTime: (newDate) => {
		set({ parameters: {...get().parameters, appointment_date: newDate} })
	},

	documents: [{ name: 'паспорт', required: true, lang_name: [] }],
	setDocuments: (newDocuments) => {
		set({ documents: newDocuments })
	},

	serverResponse: {},
	setServerResponse: (newResponse) => {
		set({ serverResponse: newResponse })
	},
	resetServerResponse: () => {
		set({ serverResponse: {} })
	},

	allBranches: [],
	setAllBranches: (receivedBranches) => {
		set({ allBranches: receivedBranches })
	},

	phoneForActivation: '',
	setPhoneForActivation: (newPhoneForActivation) => {
		set({ phoneForActivation: newPhoneForActivation })
	},
	resetPhoneForActivation: () => {
		set({ phoneForActivation: '' })
	},

	user: null,
	setUser: (newUser) => {
		set({ user: newUser })
	},

	resetSomeState: () => { 
		set({ parameters: {
			city: null,
			address: null,
			service: null,
			serviceName: [],
			client_type: null,
			is_pensioner: false,
			is_appointment: null,
			appointment_date: null,
			comment: null,
			branch: null,
			branchAddress: ''
		} })
		set({ documents: [{ name: 'паспорт', required: true, lang_name: [] }] })
		set({ allBranches: [] })
		set({ phoneForActivation: '' })
	}
}))